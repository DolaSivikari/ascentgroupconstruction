import { RichText } from "@/components/RichText";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, User, MapPin, Ruler, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import ShareMenu from "@/components/blog/ShareMenu";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CTA_TEXT } from "@/design-system/constants";
import OptimizedImage from "@/components/OptimizedImage";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/utils/structured-data";
import { blogFAQs } from "@/data/blog-faq-data";
import { usePreviewMode } from "@/hooks/usePreviewMode";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessTimelineStep from "@/components/ProcessTimelineStep";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { Wrench, Building2, Briefcase } from "lucide-react";
import {
  getRelatedForBlogPost,
  type SmartRelatedLink,
} from "@/utils/relatedLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReadingProgressBar } from "@/components/animations/ReadingProgressBar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ContentUnavailable } from "@/components/shared/ContentUnavailable";
import { SITE_URL } from "@/constants/company";
import { resolveBlogHero } from "@/data/hero-images";

const BlogPost = () => {
  const blogPostFaqs = useSharedFaqs("blogPostFaqs");
  const { slug } = useParams<{ slug: string }>();
  const { isPreview, previewToken } = usePreviewMode();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [relatedLinks, setRelatedLinks] = useState<SmartRelatedLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setRelatedLinks([]);
    setLoadFailed(false);
    setIsLoading(true);

    const fetchPost = async () => {
      try {
        if (!slug) return;
        // The RPC validates the draft token. Public reads remain published-only.
        if (isPreview && previewToken) {
          const { data, error } = await supabase.rpc("get_preview_blog_post", {
            p_slug: slug,
            p_token: previewToken,
          });
          if (error) throw error;
          if (!cancelled) setPost(data?.[0] || null);
          return;
        }
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("publish_state", "published")
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) setPost(data);
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchPost();
    return () => {
      cancelled = true;
    };
  }, [slug, isPreview, previewToken]);

  // Resolve smart related links once post is loaded
  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    getRelatedForBlogPost({
      postSlug: post.slug,
      category: post.category ?? null,
      tags: (post.tags as string[]) ?? null,
      sector: post.sector ?? null,
    }).then((links) => {
      if (!cancelled) setRelatedLinks(links);
    });
    return () => {
      cancelled = true;
    };
  }, [post]);

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
      <ContentUnavailable
        kind="Article"
        failed={loadFailed}
        backTo="/blog"
        backLabel="Back to Blog"
      />
    );
  }

  const hero = resolveBlogHero(post.featured_image, post.title);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(post.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  // Get FAQs for this blog post
  const faqs = blogFAQs[post.slug] || [];
  const isCaseStudy = ["case-study", "case_study"].includes(post.content_type);

  const schemas: any[] = [
    articleSchema({
      title: post.title,
      description: post.summary || post.seo_description,
      author: "Ascent Group Construction",
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at,
      url: `${SITE_URL}/blog/${post.slug}`,
      image: hero.image,
    }),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      {
        name: post.category || "Article",
        url: `/blog?category=${encodeURIComponent(post.category || "")}`,
      },
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
        keywords={post.seo_keywords?.join(", ") || `${post.category}, blog`}
        ogImage={hero.image}
        ogType="article"
        canonical={`${SITE_URL}/blog/${post.slug}`}
        noindex={isPreview}
        articleMeta={{
          publishedTime: post.published_at || post.created_at,
          modifiedTime: post.updated_at,
          author: post.author_name || "Ascent Group Construction",
          section: post.category,
          tags: post.seo_keywords || undefined,
        }}
        structuredData={schemas}
      />
      <Navigation />
      <ReadingProgressBar />

      {isPreview && (
        <div className="bg-warning text-[hsl(var(--ink))] text-center py-2 font-semibold">
          🔍 PREVIEW MODE - This is a draft article
        </div>
      )}

      <main>
        <PageHero
          title={post.title}
          subtitle={`${post.category} · ${formattedDate} · ${post.read_time_minutes || 5} min read`}
          image={hero.image}
          imageAlt={hero.imageAlt}
          height="small"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            {
              label: post.category || "Article",
              href: `/blog?category=${encodeURIComponent(post.category || "")}`,
            },
            { label: post.title },
          ]}
        />

        <TrustRibbon />

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
                      <p className="text-sm text-muted-foreground">
                        {post.project_location}
                      </p>
                    </div>
                  </div>
                )}
                {post.project_duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {post.project_duration}
                      </p>
                    </div>
                  </div>
                )}
                {post.project_size && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Project Size</p>
                      <p className="text-sm text-muted-foreground">
                        {post.project_size}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Before/After Images for Case Studies */}
            {isCaseStudy &&
              post.before_images &&
              post.after_images &&
              Array.isArray(post.before_images) &&
              Array.isArray(post.after_images) &&
              post.before_images.length > 0 &&
              post.after_images.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Before & After
                  </h2>
                  <BeforeAfterSlider
                    beforeImage={
                      typeof post.before_images[0] === "string"
                        ? post.before_images[0]
                        : post.before_images[0]?.url || ""
                    }
                    afterImage={
                      typeof post.after_images[0] === "string"
                        ? post.after_images[0]
                        : post.after_images[0]?.url || ""
                    }
                    altBefore={`${post.title} - Before`}
                    altAfter={`${post.title} - After`}
                  />
                </section>
              )}

            {isCaseStudy &&
              [
                ["Challenge", post.challenge],
                ["Solution", post.solution],
                ["Results", post.results],
              ].map(([label, content]) =>
                content ? (
                  <section key={label} className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                      {label}
                    </h2>
                    <RichText
                      className="prose prose-sm sm:prose-lg max-w-none break-words"
                      content={content}
                    />
                  </section>
                ) : null,
              )}
            {/* Main Content */}
            <RichText
              className="prose prose-sm sm:prose-lg max-w-none break-words mb-12"
              content={post.content}
            />

            {/* Process Steps for Case Studies */}
            {isCaseStudy &&
              post.process_steps &&
              Array.isArray(post.process_steps) &&
              post.process_steps.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Our Process
                  </h2>
                  <div className="space-y-8">
                    {post.process_steps.map((step: any, index: number) => (
                      <ProcessTimelineStep
                        key={index}
                        step={index + 1}
                        title={step.title || step.step || `Step ${index + 1}`}
                        duration={step.duration || ""}
                        description={step.description || step.details || ""}
                        details={
                          Array.isArray(step.details)
                            ? step.details
                            : [step.details || ""]
                        }
                        deliverables={
                          Array.isArray(step.deliverables)
                            ? step.deliverables
                            : []
                        }
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
              <ScrollReveal direction="up">
                <section className="mt-12">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Frequently Asked Questions
                  </h2>
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
              </ScrollReveal>
            )}

            {/* CTA */}
            <ScrollReveal direction="up" delay={150}>
              <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                  Need Professional Help?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our team is ready to bring your project to life with expert
                  craftsmanship and attention to detail.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link to="/estimate">
                    <Button size="lg">{CTA_TEXT.project}</Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline">
                      Start Your Project
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </article>

        {/* Generic post FAQ (auto schema) */}
        <section className="bg-muted/30 py-12 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Continue Reading
            </h2>
            <FAQAccordion faqs={blogPostFaqs} />
          </div>
        </section>

        {/* Related Resources — tag/sector-aware */}
        <RelatedLinksGrid
          title="Related Resources"
          description="Posts, services, and sector pages matching this article."
          links={
            relatedLinks.length > 0
              ? relatedLinks
              : [
                  {
                    title: "Blog Index",
                    description:
                      "Browse all envelope, restoration & interior insights.",
                    href: "/blog",
                    icon: Briefcase,
                  },
                  {
                    title: "All Services",
                    description: "What we self-perform across the GTA.",
                    href: "/services",
                    icon: Wrench,
                  },
                  {
                    title: "Recent Projects",
                    description: "See our portfolio across sectors.",
                    href: "/projects",
                    icon: Building2,
                  },
                ]
          }
        />
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
