import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Sitemap] Starting generation...');

    const baseUrl = 'https://ascentgroupconstruction.com';
    const urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }> = [];

    // Static pages with proper priorities
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.9', changefreq: 'weekly' },
      { path: '/services', priority: '0.9', changefreq: 'weekly' },
      { path: '/projects', priority: '0.9', changefreq: 'weekly' },
      { path: '/blog', priority: '0.8', changefreq: 'daily' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/careers', priority: '0.7', changefreq: 'monthly' },
      { path: '/prequalification', priority: '0.6', changefreq: 'monthly' },
      { path: '/estimate', priority: '0.6', changefreq: 'monthly' },
      { path: '/submit-rfp', priority: '0.6', changefreq: 'monthly' },
      { path: '/safety', priority: '0.7', changefreq: 'monthly' },
      { path: '/sustainability', priority: '0.7', changefreq: 'monthly' },
      { path: '/faq', priority: '0.7', changefreq: 'monthly' },
      { path: '/company/team', priority: '0.7', changefreq: 'monthly' },
      { path: '/company/certifications-insurance', priority: '0.7', changefreq: 'monthly' },
      { path: '/company/equipment-resources', priority: '0.6', changefreq: 'monthly' },
      { path: '/company/developers', priority: '0.7', changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: page.priority,
        changefreq: page.changefreq,
      });
    });

    // Markets pages
    const markets = [
      'commercial', 'multi-family', 'industrial', 'institutional',
      'education', 'healthcare', 'hospitality', 'retail'
    ];
    markets.forEach(market => {
      urls.push({
        loc: `${baseUrl}/markets/${market}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'monthly',
      });
    });

    // Resources pages
    const resources = ['service-areas', 'warranties', 'financing', 'contractor-portal'];
    resources.forEach(resource => {
      urls.push({
        loc: `${baseUrl}/resources/${resource}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.6',
        changefreq: 'monthly',
      });
    });

    // Published services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('slug, updated_at')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (servicesError) {
      console.error('[Sitemap] Error fetching services:', servicesError);
    } else if (services) {
      console.log(`[Sitemap] Found ${services.length} published services`);
      services.forEach(service => {
        urls.push({
          loc: `${baseUrl}/services/${service.slug}`,
          lastmod: new Date(service.updated_at).toISOString().split('T')[0],
          priority: '0.85',
          changefreq: 'weekly',
        });
      });
    }

    // Published projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (projectsError) {
      console.error('[Sitemap] Error fetching projects:', projectsError);
    } else if (projects) {
      console.log(`[Sitemap] Found ${projects.length} published projects`);
      projects.forEach(project => {
        urls.push({
          loc: `${baseUrl}/projects/${project.slug}`,
          lastmod: new Date(project.updated_at).toISOString().split('T')[0],
          priority: '0.7',
          changefreq: 'monthly',
        });
      });
    }

    // Published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, content_type')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (blogError) {
      console.error('[Sitemap] Error fetching blog posts:', blogError);
    } else if (blogPosts) {
      console.log(`[Sitemap] Found ${blogPosts.length} published blog posts`);
      blogPosts.forEach(post => {
        const pathPrefix = post.content_type === 'case_study' ? '/case-studies' : '/blog';
        urls.push({
          loc: `${baseUrl}${pathPrefix}/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          priority: '0.7',
          changefreq: 'monthly',
        });
      });
    }

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    console.log(`[Sitemap] Generated sitemap with ${urls.length} URLs`);

    // Log successful generation
    try {
      await supabase.from('sitemap_logs').insert({
        url_count: urls.length,
        status: 'success',
      });
    } catch (logError) {
      console.error('[Sitemap] Failed to log generation:', logError);
    }

    return new Response(sitemap, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });

  } catch (error: any) {
    console.error('[Sitemap] Generation failed:', error);

    // Log error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('sitemap_logs').insert({
        url_count: 0,
        status: 'error',
        error_message: error.message,
      });
    } catch (logError) {
      console.error('[Sitemap] Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to generate sitemap',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});