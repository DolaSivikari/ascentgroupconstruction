import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders, handleCors } from '../_shared/http.ts';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // Require authenticated editor/admin caller
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
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data: canEdit, error: roleErr } = await supabaseAdmin.rpc('can_edit_content', { _user_id: userData.user.id });
    if (roleErr || !canEdit) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { title, subtitle, summary, description } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context from available fields
    const context = [
      `Title: ${title}`,
      subtitle ? `Subtitle: ${subtitle}` : '',
      summary ? `Summary: ${summary}` : '',
      description ? `Description: ${description}` : ''
    ].filter(Boolean).join('\n\n');

    const prompt = `You are an expert in SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) for construction projects.

Analyze this construction project and generate optimized content:

${context}

Generate:
1. SEO Title (50-60 characters): Must include primary keywords, be compelling, and work for traditional search engines
2. SEO Description (120-160 characters): Must include secondary keywords, location keywords (Ontario/GTA if applicable), and a clear call-to-action

Optimization requirements:
- Include project type keywords (commercial, institutional, multi-family, renovation, etc.)
- Include location-based keywords when mentioned
- Use natural, conversational language for AI search engines
- Create action-oriented text for click-through
- Ensure featured snippet optimization

Return ONLY a JSON object with this exact structure:
{
  "seo_title": "your generated title here",
  "seo_description": "your generated description here"
}`;

    console.log('[generate-seo-content] Calling Lovable AI with context length:', context.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an SEO expert specializing in construction and commercial projects. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-seo-content] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires additional credits. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from AI');
    }

    console.log('[generate-seo-content] AI response:', content);

    // Parse JSON from response
    let result;
    try {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[generate-seo-content] JSON parse error:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate response structure
    if (!result.seo_title || !result.seo_description) {
      throw new Error('Invalid response structure from AI');
    }

    // Validate character lengths
    if (result.seo_title.length > 60) {
      result.seo_title = result.seo_title.substring(0, 57) + '...';
    }
    if (result.seo_description.length > 160) {
      result.seo_description = result.seo_description.substring(0, 157) + '...';
    }

    console.log('[generate-seo-content] Success:', {
      title_length: result.seo_title.length,
      description_length: result.seo_description.length
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-seo-content] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
