import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/ui/Button';
import { Link } from 'react-router-dom';
import { Check, Mail } from 'lucide-react';
import SEO from '@/components/SEO';
import { trackConversion } from '@/lib/analytics';

interface ContentBlock {
  type: 'intro' | 'features' | 'services_grid' | 'document_list' | 'cta';
  content?: string;
  items?: string[];
  services?: Array<{ title: string; description: string }>;
  title?: string;
  documents?: Array<{ title: string; action: string; subject?: string }>;
  primary?: { text: string; url: string };
  secondary?: { text: string; url: string };
}

interface SpecialtyPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content_blocks: ContentBlock[];
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
}

const IntroBlock = ({ content }: { content: string }) => (
  <div className="max-w-3xl mx-auto">
    <p className="text-lg text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

const FeaturesBlock = ({ items }: { items: string[] }) => (
  <div className="max-w-3xl mx-auto">
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ServicesGridBlock = ({ services }: { services: Array<{ title: string; description: string }> }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    {services.map((service, idx) => (
      <div key={idx} className="p-6 border border-border rounded-lg bg-card hover:border-primary transition-colors">
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-muted-foreground">{service.description}</p>
      </div>
    ))}
  </div>
);

const DocumentListBlock = ({ 
  title, 
  documents 
}: { 
  title: string; 
  documents: Array<{ title: string; action: string; subject?: string }> 
}) => (
  <div className="max-w-3xl mx-auto">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {documents.map((doc, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
          <span className="text-muted-foreground">{doc.title}</span>
          {doc.action === 'email' && (
            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <a href={`mailto:hebun.isik.ca@gmail.com?subject=${encodeURIComponent(doc.subject || doc.title)}`}>
                <Mail className="h-4 w-4 mr-2" />
                Request by Email
              </a>
            </Button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const CTABlock = ({ 
  primary, 
  secondary 
}: { 
  primary: { text: string; url: string }; 
  secondary?: { text: string; url: string } 
}) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
    <Button asChild size="lg">
      <Link to={primary.url}>{primary.text}</Link>
    </Button>
    {secondary && (
      <Button asChild size="lg" variant="outline">
        <Link to={secondary.url}>{secondary.text}</Link>
      </Button>
    )}
  </div>
);

const DynamicSpecialtyPage = () => {
  const location = window.location.pathname;
  const slug = location.substring(1); // Remove leading slash
  
  const { data: page, isLoading, error } = useQuery<SpecialtyPage>({
    queryKey: ['specialty-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialty_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      // Parse content_blocks from JSON
      return {
        ...data,
        content_blocks: data.content_blocks as unknown as ContentBlock[]
      } as SpecialtyPage;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (page) {
      trackConversion('specialty_page_view', { page: page.slug });
    }
  }, [page]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <SEO
        title={page.meta_title}
        description={page.meta_description}
        ogImage={page.og_image_url}
      />
      <Navigation />
      <main id="main-content" role="main" className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground">
                  {page.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content Blocks */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {page.content_blocks.map((block, idx) => (
                <div key={idx}>
                  {block.type === 'intro' && block.content && (
                    <IntroBlock content={block.content} />
                  )}
                  {block.type === 'features' && block.items && (
                    <FeaturesBlock items={block.items} />
                  )}
                  {block.type === 'services_grid' && block.services && (
                    <ServicesGridBlock services={block.services} />
                  )}
                  {block.type === 'document_list' && block.documents && block.title && (
                    <DocumentListBlock title={block.title} documents={block.documents} />
                  )}
                  {block.type === 'cta' && block.primary && (
                    <CTABlock primary={block.primary} secondary={block.secondary} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DynamicSpecialtyPage;
