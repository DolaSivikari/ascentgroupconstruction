import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scheduled Search Console data fetch...');

    // Get all users who have Google auth tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('google_auth_tokens')
      .select('user_id, access_token, refresh_token, token_expiry, scope');

    if (tokensError) {
      console.error('Error fetching tokens:', tokensError);
      throw tokensError;
    }

    console.log(`Found ${tokens?.length || 0} users with Google auth tokens`);

    let totalRecordsStored = 0;
    let successCount = 0;
    let errorCount = 0;

    // Fetch data for each user
    for (const token of tokens || []) {
      try {
        console.log(`Processing user: ${token.user_id}`);
        
        let accessToken = token.access_token;
        const tokenExpiry = new Date(token.token_expiry);

        // Refresh token if expired
        if (tokenExpiry <= new Date()) {
          console.log(`Token expired for user ${token.user_id}, refreshing...`);
          
          const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('GOOGLE_SEARCH_CONSOLE_CLIENT_ID')!,
              client_secret: Deno.env.get('GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET')!,
              refresh_token: token.refresh_token!,
              grant_type: 'refresh_token',
            }),
          });

          if (!refreshResponse.ok) {
            console.error(`Failed to refresh token for user ${token.user_id}`);
            errorCount++;
            continue;
          }

          const refreshData = await refreshResponse.json();
          accessToken = refreshData.access_token;

          // Update token in database
          await supabase
            .from('google_auth_tokens')
            .update({
              access_token: accessToken,
              token_expiry: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
            })
            .eq('user_id', token.user_id);
        }

        // Get the user's site URL from previous fetches or use a default
        const { data: existingData } = await supabase
          .from('search_console_data')
          .select('site_url')
          .eq('user_id', token.user_id)
          .limit(1)
          .single();

        // If no existing data, skip this user (they need to manually fetch first)
        if (!existingData?.site_url) {
          console.log(`No site URL found for user ${token.user_id}, skipping...`);
          continue;
        }

        const siteUrl = existingData.site_url;
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 7 days
        const endDate = new Date().toISOString().split('T')[0];

        // Fetch Search Console data
        const searchConsoleResponse = await fetch(
          `https://searchconsole.googleapis.com/v1/webmasters/searchAnalytics/query?siteUrl=${encodeURIComponent(siteUrl)}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate,
              endDate,
              dimensions: ['page', 'query', 'date'],
              rowLimit: 25000,
            }),
          }
        );

        if (!searchConsoleResponse.ok) {
          const errorText = await searchConsoleResponse.text();
          console.error(`Search Console API error for user ${token.user_id}:`, errorText);
          errorCount++;
          continue;
        }

        const searchConsoleData = await searchConsoleResponse.json();
        const rows = searchConsoleData.rows || [];

        console.log(`Fetched ${rows.length} rows for user ${token.user_id}`);

        // Store data in batches
        const batchSize = 1000;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize).map((row: any) => ({
            user_id: token.user_id,
            site_url: siteUrl,
            page_path: row.keys[0],
            query: row.keys[1],
            date: row.keys[2],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          }));

          const { error: insertError } = await supabase
            .from('search_console_data')
            .upsert(batch, {
              onConflict: 'user_id,site_url,page_path,query,date',
            });

          if (insertError) {
            console.error(`Error storing batch for user ${token.user_id}:`, insertError);
          } else {
            totalRecordsStored += batch.length;
          }
        }

        successCount++;
        console.log(`Successfully processed user ${token.user_id}`);
      } catch (userError) {
        console.error(`Error processing user ${token.user_id}:`, userError);
        errorCount++;
      }
    }

    console.log(`Scheduled fetch complete: ${successCount} successful, ${errorCount} errors, ${totalRecordsStored} total records stored`);

    return new Response(
      JSON.stringify({
        success: true,
        usersProcessed: successCount,
        errors: errorCount,
        recordsStored: totalRecordsStored,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Scheduled fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});