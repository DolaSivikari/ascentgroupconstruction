import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'project-images';
    const stripMetadata = formData.get('stripMetadata') === 'true';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing image: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = crypto.randomUUID().split('-')[0];
    const ext = file.name.split('.').pop() || 'jpg';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const sanitizedName = baseName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `${sanitizedName}-${timestamp}-${randomStr}.${ext}`;

    console.log(`Generated filename: ${fileName}`);

    // Upload original file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '604800', // 7 days
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log(`Image uploaded successfully: ${urlData.publicUrl}`);

    // Return URLs for different formats
    // Note: For full WebP/AVIF conversion, you'd need to integrate Sharp or similar
    // For now, we return the original URL and suggest client-side srcset generation
    return new Response(
      JSON.stringify({
        url: urlData.publicUrl,
        originalUrl: urlData.publicUrl,
        fileName: fileName,
        bucket: bucket,
        size: file.size,
        type: file.type,
        // Future enhancement: return webpUrl, avifUrl after server-side conversion
        metadata: {
          stripped: stripMetadata,
          timestamp: timestamp
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in process-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
