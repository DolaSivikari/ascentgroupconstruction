import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract code and state from URL query parameters (not JSON body)
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      console.error('No authorization code in callback');
      throw new Error('Authorization code is required');
    }

    console.log('Received OAuth callback with code and state:', { hasCode: !!code, userId: state });

    // Get OAuth credentials from environment
    const clientId = Deno.env.get('GOOGLE_SEARCH_CONSOLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET');
    const redirectUri = Deno.env.get('GOOGLE_SEARCH_CONSOLE_REDIRECT_URI');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange failed:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, scope } = tokens;

    // Calculate token expiry
    const tokenExpiry = new Date(Date.now() + expires_in * 1000);

    // Get user ID from state parameter
    const userId = state;

    if (!userId) {
      console.error('No user ID in state parameter');
      throw new Error('User authentication required');
    }

    // Store tokens in database
    const { error: dbError } = await supabase
      .from('google_auth_tokens')
      .upsert({
        user_id: userId,
        access_token,
        refresh_token,
        token_expiry: tokenExpiry.toISOString(),
        scope,
      }, {
        onConflict: 'user_id',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store authentication tokens');
    }

    console.log('Successfully stored Google OAuth tokens for user:', userId);

    // Return HTML that redirects back to SEO dashboard with success message
    const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://lovable.app'}/admin/seo-dashboard?gsc_connected=true`;
    
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <script>
            window.location.href = '${dashboardUrl}';
          </script>
        </head>
        <body>
          <p>Authentication successful! Redirecting...</p>
        </body>
      </html>`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Return HTML that redirects back to SEO dashboard with error message
    const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://lovable.app'}/admin/seo-dashboard?gsc_error=${encodeURIComponent(errorMessage)}`;
    
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed</title>
          <script>
            window.location.href = '${dashboardUrl}';
          </script>
        </head>
        <body>
          <p>Authentication failed. Redirecting...</p>
        </body>
      </html>`,
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' } 
      }
    );
  }
});
