import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeAndValidate } from '@/utils/sanitize';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

import { Card, CardContent } from "@/design-system/components/Card";
import { CTABand } from "@/design-system/components/CTABand";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessTimelineStep from "@/components/ProcessTimelineStep";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { InteractiveLightbox } from "@/components/InteractiveLightbox";

import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { ChevronRight, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { formatProjectValue } from "@/utils/formatProjectValue";
import OptimizedImage from "@/components/OptimizedImage";
import { ProjectFeaturedImage } from "@/components/projects/ProjectFeaturedImage";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { projectDetailFaqs } from "@/data/page-faqs";
import { Wrench, Briefcase, Building2 } from "lucide-react";
import { getRelatedForProject, type SmartRelatedLink } from "@/utils/relatedLinks";

interface ProcessStep {
  type: string;
  step_number: number;
  title: string;
  description: string;
  duration?: string;
  image_url?: string;
  image_alt?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  category: 'before' | 'after' | 'process' | 'gallery';
  caption?: string;
  order: number;
  featured: boolean;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  category?: string;
}

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary?: string;
  featured_image?: string;
  category?: string;
  location?: string;
  project_size?: string;
  budget_range?: string;
  client_name?: string;
  duration?: string;
  start_date?: string;
  completion_date?: string;
  status?: string;
  before_images?: Array<{ url: string; alt: string; caption?: string }>;
  after_images?: Array<{ url: string; alt: string; caption?: string }>;
  content_blocks?: ProcessStep[];
  description?: string;
  challenge?: string;
  results?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  project_images?: GalleryImage[];
  services?: Service[];
  // GC Tracking Metrics
  project_value?: number;
  square_footage?: number;
  your_role?: string;
  delivery_method?: string;
  client_type?: string;
  trades_coordinated?: number;
  peak_workforce?: number;
  on_time_completion?: boolean;
  on_budget?: boolean;
  safety_incidents?: number;
  scope_of_work?: string;
  team_credits?: Array<{ role: string; name: string; company?: string }>;
  tags?: string[] | null;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedLinks, setRelatedLinks] = useState<SmartRelatedLink[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        // Fetch project
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .eq("publish_state", "published")
          .single();

        if (error) throw error;

        // Fetch project images
        const { data: images, error: imagesError } = await supabase
          .from("project_images")
          .select("*")
          .eq("project_id", data.id)
          .order("display_order");

        // Fetch project services
        const { data: projectServices } = await supabase
          .from("project_services")
          .select("service_id, services(id, name, slug, category)")
          .eq("project_id", data.id);

        const projectData = {
          ...data,
          before_images: (data.before_images as any[]) || [],
          after_images: (data.after_images as any[]) || [],
          content_blocks: (data.content_blocks as any[]) || [],
          seo_keywords: (data.seo_keywords as string[]) || [],
          project_images: (images?.map((img) => ({
            id: img.id,
            url: img.url,
            category: img.category as any,
            caption: img.caption,
            order: img.display_order,
            featured: img.featured
          })) || []) as any[],
          services: projectServices?.map((ps) => ps.services).filter(Boolean) || []
        };

        setProject(projectData as any);
      } catch (error: unknown) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, navigate]);

  // Resolve smart related links once project is loaded
  useEffect(() => {
    if (!project) return;
    let cancelled = false;
    const primaryService = project.services?.[0];
    getRelatedForProject({
      projectId: project.id,
      projectSlug: project.slug,
      category: project.category,
      tags: project.tags ?? null,
      serviceSlug: primaryService?.slug ?? null,
      serviceName: primaryService?.name ?? null,
    }).then((links) => {
      if (!cancelled) setRelatedLinks(links);
    });
    return () => {
      cancelled = true;
    };
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const processSteps = (project.content_blocks || []).filter(
    (block: ProcessStep) => block.type === "process_step"
  );

  return (
    <>
      <SEO
        title={project.seo_title || project.title}
        description={project.seo_description || project.summary || project.description || ""}
        keywords={project.seo_keywords?.join(", ")}
        ogImage={project.featured_image}
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-muted/20 mt-24">
          <div className="container mx-auto px-6 py-6 md:py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors font-medium">
                Home
              </button>
              <ChevronRight className="h-4 w-4 opacity-50" />
              <button onClick={() => navigate("/projects")} className="hover:text-foreground transition-colors font-medium">
                Projects
              </button>
              <ChevronRight className="h-4 w-4 opacity-50" />
              <span className="text-foreground font-semibold">{project.title}</span>
            </div>
          </div>
        </div>

        {/* Compact Header */}
        <div className="border-b border-border/50 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {project.category && (
                  <Badge variant="secondary">
                    {project.category}
                  </Badge>
                )}
                {project.services && project.services.length > 0 && (
                  <>
                    {project.services.map((service) => (
                      <Badge 
                        key={service.id} 
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/services/${service.slug}`)}
                      >
                        {service.name}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  {project.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image — editorial cinematic banner */}
        <div className="container mx-auto px-4 py-8">
          {project.featured_image ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative block w-full overflow-hidden rounded-xl shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="View full image"
            >
              <ProjectFeaturedImage
                src={project.featured_image}
                alt={project.title}
                variant="banner"
                priority
              >
                {/* Subtle bottom gradient for premium feel */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {/* Expand hint */}
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-3.5 w-3.5" />
                  View full image
                </div>
              </ProjectFeaturedImage>
            </button>
          ) : (
            <ProjectFeaturedImage
              src={null}
              alt={project.title}
              variant="banner"
              className="rounded-xl"
            />
          )}

          {project.featured_image && (
            <InteractiveLightbox
              images={[
                {
                  src: project.featured_image,
                  alt: project.title,
                  caption: project.title,
                },
              ]}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              initialIndex={0}
            />
          )}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <ProjectSidebar
                clientName={project.client_name}
                location={project.location}
                startDate={project.start_date}
                completionDate={project.completion_date}
                projectSize={project.project_size}
                budgetRange={project.budget_range}
                category={project.category}
                status={project.status}
              />

              {/* GC Metrics Card */}
              {(project.project_value || project.square_footage || project.your_role || project.delivery_method) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Project Metrics</h3>
                    
                    {formatProjectValue(project.project_value, 'full') && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contract Value</p>
                        <p className="font-semibold text-lg">
                          {formatProjectValue(project.project_value, 'full')}
                        </p>
                      </div>
                    )}
                    
                    {project.square_footage && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Square Footage</p>
                        <p className="font-semibold">{project.square_footage.toLocaleString()} sq ft</p>
                      </div>
                    )}
                    
                    {project.your_role && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Our Role</p>
                        <Badge variant="secondary">{project.your_role}</Badge>
                      </div>
                    )}
                    
                    {project.delivery_method && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Delivery Method</p>
                        <p className="font-semibold">{project.delivery_method}</p>
                      </div>
                    )}
                    
                    {project.client_type && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Client Type</p>
                        <p className="font-semibold">{project.client_type}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Performance Metrics Card */}
              {(project.trades_coordinated || project.peak_workforce || project.on_time_completion !== undefined || project.on_budget !== undefined || project.safety_incidents !== undefined) && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Performance</h3>
                    
                    {project.trades_coordinated && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Trades Coordinated</p>
                        <p className="font-bold text-lg">{project.trades_coordinated}</p>
                      </div>
                    )}
                    
                    {project.peak_workforce && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Peak Workforce</p>
                        <p className="font-bold text-lg">{project.peak_workforce}</p>
                      </div>
                    )}
                    
                    {project.on_time_completion !== undefined && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">On-Time Completion</p>
                        <Badge variant={project.on_time_completion ? "default" : "destructive"}>
                          {project.on_time_completion ? "Yes" : "No"}
                        </Badge>
                      </div>
                    )}
                    
                    {project.on_budget !== undefined && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">On Budget</p>
                        <Badge variant={project.on_budget ? "default" : "destructive"}>
                          {project.on_budget ? "Yes" : "No"}
                        </Badge>
                      </div>
                    )}
                    
                    {project.safety_incidents !== undefined && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Safety Incidents</p>
                        <Badge variant={project.safety_incidents === 0 ? "default" : "secondary"}>
                          {project.safety_incidents}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 space-y-12">
              {/* Project Summary */}
              {project.summary && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Project Overview</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.summary}
                  </p>
                </section>
              )}

              {/* Full Description (Rich Text) */}
              {project.description && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Project Description</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div 
                        className="prose prose-lg max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeAndValidate(project.description || '').sanitized }}
                      />
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Scope of Work */}
              {project.scope_of_work && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Scope of Work</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div 
                        className="prose prose-lg max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeAndValidate(project.scope_of_work || '').sanitized }}
                      />
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Enhanced Case Study Component */}
              <ProjectCaseStudy
                challenge={project.challenge ? sanitizeAndValidate(project.challenge).sanitized : undefined}
                scopeDelivered={project.scope_of_work ? sanitizeAndValidate(project.scope_of_work).sanitized : undefined}
                solution={project.description ? sanitizeAndValidate(project.description).sanitized : undefined}
                results={project.results ? sanitizeAndValidate(project.results).sanitized : undefined}
                metrics={[
                  ...(formatProjectValue(project.project_value, 'full') ? [{
                    label: "Contract Value",
                    value: formatProjectValue(project.project_value, 'full')!,
                  }] : []),
                  ...(project.square_footage ? [{
                    label: "Square Footage",
                    value: `${project.square_footage.toLocaleString()} sq ft`,
                  }] : []),
                  ...(project.trades_coordinated ? [{
                    label: "Trades Coordinated",
                    value: project.trades_coordinated.toString(),
                  }] : []),
                  ...(project.peak_workforce ? [{
                    label: "Peak Workforce",
                    value: `${project.peak_workforce} workers`,
                  }] : []),
                ]}
                keyOutcomes={[
                  ...(project.on_time_completion ? ["✓ Completed on-time as scheduled"] : []),
                  ...(project.on_budget ? ["✓ Delivered on-budget without overruns"] : []),
                  ...(project.safety_incidents === 0 ? ["✓ Zero safety incidents recorded"] : []),
                  ...(project.duration ? [`✓ Project duration: ${project.duration}`] : []),
                ]}
              />

              {/* Enhanced Project Gallery - New unified gallery system */}
              {project.project_images && project.project_images.length > 0 && (
                <ProjectGallery
                  images={project.project_images}
                  projectTitle={project.title}
                  showBeforeAfter={true}
                  showProcessSteps={true}
                />
              )}

              {/* Legacy Before & After (fallback for old projects) */}
              {(!project.project_images || project.project_images.length === 0) &&
               project.before_images && project.before_images.length > 0 && 
               project.after_images && project.after_images.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Before & After</h2>
                  <div className="space-y-8">
                    {project.before_images.map((beforeImg: any, index: number) => {
                      const afterImg = project.after_images?.[index];
                      if (!afterImg) return null;
                      
                      return (
                        <div key={index} className="space-y-4">
                          <BeforeAfterSlider
                            beforeImage={beforeImg.url}
                            afterImage={afterImg.url}
                            altBefore={beforeImg.alt || "Before image"}
                            altAfter={afterImg.alt || "After image"}
                          />
                          {(beforeImg.caption || afterImg.caption) && (
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="text-center italic">{beforeImg.caption}</div>
                              <div className="text-center italic">{afterImg.caption}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Project Process Timeline */}
              {processSteps.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Process</h2>
                  <div className="space-y-6">
                    {processSteps.map((step: ProcessStep) => (
                      <ProcessTimelineStep
                        key={step.step_number}
                        step={step.step_number}
                        title={step.title}
                        duration={step.duration || ""}
                        description={step.description}
                        details={[]}
                        deliverables={[]}
                        image={step.image_url}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Team Credits */}
              {project.team_credits && project.team_credits.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Team</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {project.team_credits.map((member, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary font-bold text-sm">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">{member.name}</p>
                              <p className="text-sm text-primary">{member.role}</p>
                              {member.company && (
                                <p className="text-xs text-muted-foreground">{member.company}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Related Services Cross-link */}
              {project.services && project.services.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Related Services</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.services.map((service) => (
                      <Badge
                        key={service.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm py-2 px-4"
                        onClick={() => navigate(`/services/${service.slug}`)}
                      >
                        {service.name} →
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>

          {/* Project FAQ (auto FAQ schema) */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Common Project Questions</h2>
            <p className="text-center text-muted-foreground mb-8">
              How we scope, price, and manage projects of this type.
            </p>
            <FAQAccordion faqs={projectDetailFaqs} />
          </div>

          {/* Related Resources */}
          <RelatedLinksGrid
            title="Explore More"
            description="Other projects, services, and partner resources."
            links={[
              { title: "More Projects", description: "Browse our full portfolio across the GTA.", href: "/projects", icon: Briefcase },
              { title: "All Services", description: "What we self-perform on similar scopes.", href: "/services", icon: Wrench },
              { title: "Capabilities", description: "How we deliver — process and accountability.", href: "/capabilities", icon: Building2 },
            ]}
            background="default"
          />

          {/* CTA */}
          <div className="mt-16">
            <CTABand
              title="Need a Similar Project?"
              description="Let's discuss how we can deliver the same quality and professionalism on your next scope."
              primaryCta={{ text: "Request a Quote", href: "/estimate" }}
              secondaryCta={{ text: "Contact Our Team", href: "/contact" }}
              variant="light"
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
