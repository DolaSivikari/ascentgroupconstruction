import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';
import { createErrorResponse, logSecurityError } from '../_shared/errorHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginAttemptRequest {
  email: string;
  success: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, success }: LoginAttemptRequest = await req.json();

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
      console.log(`Account locked for ${email} until ${lockoutData.locked_until}`);
      return new Response(
        JSON.stringify({ 
          locked: true, 
          locked_until: lockoutData.locked_until,
          reason: lockoutData.reason
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!success) {
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
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
        
        await supabase.from('auth_account_lockouts').insert({
          user_identifier: email,
          locked_until: lockedUntil,
          reason: `Account locked due to ${attemptCount} failed login attempts`,
        });

        // Create security alert
        await supabase.from('security_alerts').insert({
          alert_type: 'account_lockout',
          severity: 'high',
          description: `Account ${email} locked after ${attemptCount} failed login attempts from IP ${ipAddress}`,
          metadata: { email, ip_address: ipAddress, attempt_count: attemptCount },
        });

        console.log(`Account locked for ${email} after ${attemptCount} failed attempts`);

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

      // Return remaining attempts
      const attemptsRemaining = 5 - attemptCount;
      console.log(`Failed attempt for ${email}. ${attemptsRemaining} attempts remaining.`);

      return new Response(
        JSON.stringify({ 
          locked: false, 
          attempts_remaining: attemptsRemaining,
          warning: attemptsRemaining <= 2 ? `Only ${attemptsRemaining} attempts remaining before account lockout` : null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Successful login - clear failed attempts
      await supabase
        .from('auth_failed_attempts')
        .delete()
        .eq('user_identifier', email);

      console.log(`Successful login for ${email}, cleared failed attempts`);

      return new Response(
        JSON.stringify({ success: true }),
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
