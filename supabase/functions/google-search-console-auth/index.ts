import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleCors } from '../_shared/http.ts';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await authClient.auth.getUser(token);
    if (userError || !user) throw new Error('Invalid user token');

    const clientId = Deno.env.get('GOOGLE_SEARCH_CONSOLE_CLIENT_ID');
    const redirectUri = Deno.env.get('GOOGLE_SEARCH_CONSOLE_REDIRECT_URI');
    if (!clientId || !redirectUri) {
      throw new Error('Google Search Console OAuth credentials not configured');
    }

    // Generate cryptographically random state nonce and persist it bound to user
    const stateBytes = new Uint8Array(32);
    crypto.getRandomValues(stateBytes);
    const stateNonce = Array.from(stateBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const admin = createClient(supabaseUrl, serviceKey);
    const { error: insertErr } = await admin.from('google_oauth_states').insert({
      state: stateNonce,
      user_id: user.id,
    });
    if (insertErr) {
      console.error('Failed to persist oauth state:', insertErr);
      throw new Error('Failed to initialize OAuth flow');
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/webmasters.readonly');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', stateNonce);

    return new Response(
      JSON.stringify({ authUrl: authUrl.toString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-search-console-auth:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
