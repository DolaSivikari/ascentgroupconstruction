import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/http.ts';

const ALLOWED_BUCKETS = new Set(['project-images']);
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // Require authenticated admin caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } = await authClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: isAdmin, error: roleErr } = await supabase.rpc('is_admin', { _user_id: userData.user.id });
    if (roleErr || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const requestedBucket = (formData.get('bucket') as string) || 'project-images';
    const stripMetadata = formData.get('stripMetadata') === 'true';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Whitelist bucket
    if (!ALLOWED_BUCKETS.has(requestedBucket)) {
      return new Response(JSON.stringify({ error: 'Invalid bucket' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate content type
    if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
      return new Response(JSON.stringify({ error: `Unsupported content type: ${file.type}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate extension against allowlist
    const rawExt = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : 'jpg';

    console.log(`Processing image: ${file.name}, size: ${file.size}, type: ${file.type}`);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const timestamp = Date.now();
    const randomStr = crypto.randomUUID().split('-')[0];
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const sanitizedName = baseName.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 60);
    const fileName = `${sanitizedName}-${timestamp}-${randomStr}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(requestedBucket)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '604800',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: `Upload failed: ${uploadError.message}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: urlData } = supabase.storage.from(requestedBucket).getPublicUrl(fileName);

    return new Response(
      JSON.stringify({
        url: urlData.publicUrl,
        originalUrl: urlData.publicUrl,
        fileName,
        bucket: requestedBucket,
        size: file.size,
        type: file.type,
        metadata: { stripped: stripMetadata, timestamp }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
