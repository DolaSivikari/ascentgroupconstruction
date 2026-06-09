import { createClient } from 'npm:@supabase/supabase-js@2';
import { createErrorResponse, logSecurityError } from '../_shared/errorHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface LoginAttemptRequest {
  email: string;
  success: boolean;
  checkOnly?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, success, checkOnly }: LoginAttemptRequest = await req.json();

    if (!email) {
      return createErrorResponse(
        new Error('Email is required'),
        'Email is required',
        400,
        'check-login-attempt-validation'
      );
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

    // Check if account is currently locked
    const { data: lockoutData } = await supabase
      .from('auth_account_lockouts')
      .select('*')
      .eq('user_identifier', email)
      .gt('locked_until', new Date().toISOString())
      .is('unlocked_at', null)
      .order('locked_at', { ascending: false })
      .limit(1)
      .single();

    if (lockoutData) {
      console.log(`Account locked until ${lockoutData.locked_until}`);
      return new Response(
        JSON.stringify({ 
          locked: true, 
          locked_until: lockoutData.locked_until,
          reason: lockoutData.reason
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If checkOnly, just return lockout status without recording anything
    if (checkOnly) {
      return new Response(
        JSON.stringify({ locked: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (success) {
      // SECURITY: Only allow clearing failed attempts when the caller has a valid JWT
      // and the authenticated user's email matches the email being cleared.
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        // Unauthenticated callers cannot clear failed attempts — silently ignore
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(
        authHeader.replace('Bearer ', '')
      );

      if (claimsError || !claimsData?.claims) {
        // Invalid token — silently ignore, don't clear attempts
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const authenticatedEmail = claimsData.claims.email;
      if (authenticatedEmail?.toLowerCase() !== email.toLowerCase()) {
        // Authenticated user doesn't match — don't clear another user's attempts
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verified: clear failed attempts for the authenticated user
      await supabase
        .from('auth_failed_attempts')
        .delete()
        .eq('user_identifier', email);

      console.log(`Successful login, cleared failed attempts`);

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Record failed attempt
      await supabase.from('auth_failed_attempts').insert({
        user_identifier: email,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      // Count recent failed attempts (last 15 minutes)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recentAttempts, error: countError } = await supabase
        .from('auth_failed_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_identifier', email)
        .gte('attempt_time', fifteenMinutesAgo);

      if (countError) {
        logSecurityError('failed_attempt_count', countError, { email, ip_address: ipAddress });
      }

      const attemptCount = recentAttempts?.length || 0;

      // Lock account after 5 failed attempts
      if (attemptCount >= 5) {
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        
        await supabase.from('auth_account_lockouts').insert({
          user_identifier: email,
          locked_until: lockedUntil,
          reason: `Account locked due to ${attemptCount} failed login attempts`,
        });

        await supabase.from('security_alerts').insert({
          alert_type: 'account_lockout',
          severity: 'high',
          description: `Account locked after ${attemptCount} failed login attempts from IP ${ipAddress}`,
          metadata: { ip_address: ipAddress, attempt_count: attemptCount },
        });

        console.log(`Account locked after ${attemptCount} failed attempts`);

        return new Response(
          JSON.stringify({ 
            locked: true, 
            locked_until: lockedUntil,
            attempts_remaining: 0,
            reason: 'Too many failed login attempts. Account locked for 30 minutes.'
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const attemptsRemaining = 5 - attemptCount;
      console.log(`Failed login attempt. ${attemptsRemaining} attempts remaining.`);

      return new Response(
        JSON.stringify({ 
          locked: false, 
          attempts_remaining: attemptsRemaining,
          warning: attemptsRemaining <= 2 ? `Only ${attemptsRemaining} attempts remaining before account lockout` : null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    logSecurityError('check_login_attempt', error, { timestamp: new Date().toISOString() });
    return createErrorResponse(
      error,
      'Failed to process login attempt',
      500,
      'check-login-attempt'
    );
  }
});
