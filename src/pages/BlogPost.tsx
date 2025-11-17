import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, User, MapPin, Ruler, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ContentPageHeader from "@/components/ContentPageHeader";
import ShareMenu from "@/components/blog/ShareMenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CTA_TEXT } from "@/design-system/constants";
import OptimizedImage from "@/components/OptimizedImage";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/utils/structured-data";
import { blogFAQs } from "@/data/blog-faq-data";
import { usePreviewMode } from "@/hooks/usePreviewMode";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessTimelineStep from "@/components/ProcessTimelineStep";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sanitizeAndValidate } from "@/utils/sanitize";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isPreview } = usePreviewMode();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      const query = supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug);
      
      // Only filter by publish_state if NOT in preview mode
      if (!isPreview) {
        query.eq("publish_state", "published");
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (!error && data) {
        setPost(data);
      }
      setIsLoading(false);
    };
    
    fetchPost();
  }, [slug, isPreview]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  // Convert content to HTML (simple version for database content)
  const formatContent = (content: string) => {
    if (!content) return '';
    return content
      .split('\n\n')
      .map((paragraph, idx) => `<p key="${idx}" class="text-foreground/90 leading-relaxed mb-4">${paragraph}</p>`)
      .join('');
  };

  // Get FAQs for this blog post  
  const faqs = blogFAQs[post.slug] || [];
  const isCaseStudy = post.content_type === 'case-study';
  
  const schemas: any[] = [
    articleSchema({
      title: post.title,
      description: post.summary || post.seo_description,
      author: "Ascent Group Construction",
      datePublished: post.published_at || post.created_at,
      image: post.featured_image || '',
    }),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.category || "Article", url: `/blog?category=${encodeURIComponent(post.category || '')}` },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
  ];
  
  if (faqs.length > 0) {
    schemas.push(faqSchema(faqs));
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={post.seo_title || post.title}
        description={post.seo_description || post.summary}
        keywords={post.seo_keywords?.join(', ') || `${post.category}, blog`}
        structuredData={schemas}
      />
      <Navigation />
      
      {isPreview && (
        <div className="bg-yellow-500 text-[hsl(var(--ink))] text-center py-2 font-semibold">
          🔍 PREVIEW MODE - This is a draft article
        </div>
      )}
      
      <main>
        <ContentPageHeader
          title={post.title}
          subtitle={`${post.category} · ${formattedDate} · ${post.read_time_minutes || 5} min read`}
          imageUrl={post.featured_image || '/placeholder.svg'}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.category || "Article", href: `/blog?category=${encodeURIComponent(post.category || '')}` },
            { label: post.title }
          ]}
        />

        {/* Content */}
        <article className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Case Study Project Details */}
            {isCaseStudy && (
              <div className="grid md:grid-cols-3 gap-6 mb-12 p-6 bg-muted/30 rounded-lg">
                {post.project_location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-muted-foreground">{post.project_location}</p>
                    </div>
                  </div>
                )}
                {post.project_duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">{post.project_duration}</p>
                    </div>
                  </div>
                )}
                {post.project_size && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Project Size</p>
                      <p className="text-sm text-muted-foreground">{post.project_size}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Before/After Images for Case Studies */}
            {isCaseStudy && post.before_images && post.after_images && 
             Array.isArray(post.before_images) && Array.isArray(post.after_images) &&
             post.before_images.length > 0 && post.after_images.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Before & After</h2>
                <BeforeAfterSlider
                  beforeImage={typeof post.before_images[0] === 'string' ? post.before_images[0] : post.before_images[0]?.url || ''}
                  afterImage={typeof post.after_images[0] === 'string' ? post.after_images[0] : post.after_images[0]?.url || ''}
                  altBefore={`${post.title} - Before`}
                  altAfter={`${post.title} - After`}
                />
              </section>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-sm sm:prose-lg max-w-none break-words mb-12"
              dangerouslySetInnerHTML={{ __html: sanitizeAndValidate(formatContent(post.content || '')).sanitized }}
            />

            {/* Process Steps for Case Studies */}
            {isCaseStudy && post.process_steps && Array.isArray(post.process_steps) && post.process_steps.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Our Process</h2>
                <div className="space-y-8">
                  {post.process_steps.map((step: any, index: number) => (
                    <ProcessTimelineStep
                      key={index}
                      step={index + 1}
                      title={step.title || step.step || `Step ${index + 1}`}
                      duration={step.duration || ''}
                      description={step.description || step.details || ''}
                      details={Array.isArray(step.details) ? step.details : [step.details || '']}
                      deliverables={Array.isArray(step.deliverables) ? step.deliverables : []}
                      image={step.image}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Share this article</h3>
                <ShareMenu />
              </div>
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* CTA */}
            <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Professional Help?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is ready to bring your project to life with expert craftsmanship and attention to detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/estimate">
                  <Button size="lg">
                    {CTA_TEXT.project}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts - Removed for now since we don't have related posts query */}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
