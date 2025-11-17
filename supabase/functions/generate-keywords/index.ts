import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KeywordRequest {
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { content }: KeywordRequest = await req.json();

    if (!content || content.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Content must be at least 50 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating keywords for content...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Analyze content and suggest relevant keywords for search engine optimization. Return keywords as a JSON array.'
          },
          {
            role: 'user',
            content: `Analyze this content and suggest 10-15 relevant SEO keywords. Consider:
1. Primary keywords (high search volume, directly related)
2. Long-tail keywords (specific phrases users might search)
3. Semantic variations

Content:
${content.substring(0, 2000)}

Return ONLY a JSON object with this structure:
{
  "primary_keywords": ["keyword1", "keyword2"],
  "long_tail_keywords": ["phrase 1", "phrase 2"],
  "semantic_keywords": ["related term 1", "related term 2"]
}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const keywords = JSON.parse(jsonMatch[0]);

    console.log('Keywords generated successfully');

    return new Response(
      JSON.stringify({ 
        keywords,
        all_keywords: [
          ...(keywords.primary_keywords || []),
          ...(keywords.long_tail_keywords || []),
          ...(keywords.semantic_keywords || [])
        ]
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in generate-keywords:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
