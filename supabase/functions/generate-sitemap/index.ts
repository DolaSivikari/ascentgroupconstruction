import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Service area cities for location pages
const serviceAreaCities = [
  "toronto", "mississauga", "brampton", "vaughan", "markham",
  "richmond-hill", "oakville", "burlington", "hamilton",
  "ajax", "pickering", "whitby", "oshawa", "newmarket", "aurora", "milton"
];

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
    const urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string; images?: Array<{ loc: string; title?: string }> }> = [];

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
      { path: '/estimate', priority: '0.8', changefreq: 'monthly' },
      { path: '/submit-rfp', priority: '0.6', changefreq: 'monthly' },
      { path: '/sustainability', priority: '0.7', changefreq: 'monthly' },
      { path: '/faq', priority: '0.7', changefreq: 'weekly' },
      { path: '/our-process', priority: '0.7', changefreq: 'monthly' },
      { path: '/why-specialty-contractor', priority: '0.7', changefreq: 'monthly' },
      { path: '/company/certifications-insurance', priority: '0.7', changefreq: 'monthly' },
      { path: '/company/equipment-resources', priority: '0.6', changefreq: 'monthly' },
      { path: '/company/developers', priority: '0.7', changefreq: 'monthly' },
      // Audience pages
      { path: '/for-general-contractors', priority: '0.8', changefreq: 'weekly' },
      { path: '/property-managers', priority: '0.8', changefreq: 'weekly' },
      { path: '/homeowners', priority: '0.8', changefreq: 'weekly' },
      { path: '/commercial-clients', priority: '0.8', changefreq: 'weekly' },
      // Resources
      { path: '/resources/service-areas', priority: '0.7', changefreq: 'monthly' },
      { path: '/resources/contractor-portal', priority: '0.6', changefreq: 'monthly' },
      // Legal
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' },
      { path: '/accessibility', priority: '0.3', changefreq: 'yearly' },
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: page.priority,
        changefreq: page.changefreq,
      });
    });

    // Service Area Location Pages (Local SEO)
    console.log(`[Sitemap] Adding ${serviceAreaCities.length} location pages`);
    serviceAreaCities.forEach(city => {
      urls.push({
        loc: `${baseUrl}/service-areas/${city}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'monthly',
      });
    });

    // Published services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('slug, updated_at, featured_image, name')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (servicesError) {
      console.error('[Sitemap] Error fetching services:', servicesError);
    } else if (services) {
      console.log(`[Sitemap] Found ${services.length} published services`);
      services.forEach(service => {
        const urlEntry: typeof urls[0] = {
          loc: `${baseUrl}/services/${service.slug}`,
          lastmod: new Date(service.updated_at).toISOString().split('T')[0],
          priority: '0.85',
          changefreq: 'weekly',
        };
        if (service.featured_image) {
          urlEntry.images = [{ loc: service.featured_image, title: service.name }];
        }
        urls.push(urlEntry);
      });
    }

    // Published projects with images
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('slug, updated_at, featured_image, title, gallery')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (projectsError) {
      console.error('[Sitemap] Error fetching projects:', projectsError);
    } else if (projects) {
      console.log(`[Sitemap] Found ${projects.length} published projects`);
      projects.forEach(project => {
        const images: Array<{ loc: string; title?: string }> = [];
        if (project.featured_image) {
          images.push({ loc: project.featured_image, title: project.title });
        }
        // Add gallery images if available
        if (project.gallery && Array.isArray(project.gallery)) {
          project.gallery.slice(0, 5).forEach((img: any) => {
            if (img.url) {
              images.push({ loc: img.url, title: img.caption || project.title });
            }
          });
        }
        urls.push({
          loc: `${baseUrl}/projects/${project.slug}`,
          lastmod: new Date(project.updated_at).toISOString().split('T')[0],
          priority: '0.7',
          changefreq: 'monthly',
          images: images.length > 0 ? images : undefined,
        });
      });
    }

    // Published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, content_type, featured_image, title')
      .eq('publish_state', 'published')
      .order('updated_at', { ascending: false });

    if (blogError) {
      console.error('[Sitemap] Error fetching blog posts:', blogError);
    } else if (blogPosts) {
      console.log(`[Sitemap] Found ${blogPosts.length} published blog posts`);
      blogPosts.forEach(post => {
        const pathPrefix = post.content_type === 'case_study' ? '/case-studies' : '/blog';
        const urlEntry: typeof urls[0] = {
          loc: `${baseUrl}${pathPrefix}/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          priority: '0.7',
          changefreq: 'monthly',
        };
        if (post.featured_image) {
          urlEntry.images = [{ loc: post.featured_image, title: post.title }];
        }
        urls.push(urlEntry);
      });
    }

    // Generate XML sitemap with image support
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    for (const url of urls) {
      sitemap += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;
      
      if (url.images && url.images.length > 0) {
        for (const img of url.images) {
          sitemap += `
    <image:image>
      <image:loc>${img.loc}</image:loc>${img.title ? `
      <image:title><![CDATA[${img.title}]]></image:title>` : ''}
    </image:image>`;
        }
      }
      
      sitemap += `
  </url>
`;
    }

    sitemap += '</urlset>';

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
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
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