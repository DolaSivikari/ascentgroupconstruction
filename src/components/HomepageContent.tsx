import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HomepageContent = () => {
  const [content, setContent] = useState({
    headline: "Building Envelope & Interior Trades Specialist",
    subheadline: "Founded by construction professionals with 15+ years of highrise and commercial experience",
    hero_description: "Ascent Group Construction delivers specialized building envelope and interior trade services for commercial and multi-family properties across Ontario's GTA. Established in 2025 and building on 15+ years of industry experience, we provide professional execution with a 10-person self-performed crew—handling EIFS, stucco, masonry restoration, sealant replacement, painting, tile, and interior finishes with clear accountability and safety compliance.",
    cta_primary_text: "Request Site Assessment",
    cta_primary_url: "/contact",
    cta_secondary_text: "View Our Services",
    cta_secondary_url: "/services",
    cta_tertiary_text: "For General Contractors",
    cta_tertiary_url: "/for-general-contractors"
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (data) {
        setContent({
          headline: data.headline || content.headline,
          subheadline: data.subheadline || content.subheadline,
          hero_description: data.hero_description || content.hero_description,
          cta_primary_text: data.cta_primary_text || content.cta_primary_text,
          cta_primary_url: data.cta_primary_url || content.cta_primary_url,
          cta_secondary_text: data.cta_secondary_text || content.cta_secondary_text,
          cta_secondary_url: data.cta_secondary_url || content.cta_secondary_url,
          cta_tertiary_text: data.cta_tertiary_text || content.cta_tertiary_text,
          cta_tertiary_url: data.cta_tertiary_url || content.cta_tertiary_url,
        });
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {content.headline}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-6">
          {content.subheadline}
        </p>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>
            {content.hero_description}
          </p>
          
          <p>
            Whether you're a property manager protecting an existing asset, a developer planning new construction, or a general contractor needing a reliable trade partner, we bring professional project management, safety compliance (working toward full WSIB and COR certification), comprehensive documentation, and warranty-backed installation. Our specialty focus means no distractions—we execute envelope and interior trades with quality workmanship and full accountability.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8 not-prose">
            <Link 
              to={content.cta_primary_url} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-sm)] hover:bg-primary/90 link-hover font-semibold"
            >
              {content.cta_primary_text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to={content.cta_secondary_url} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-[var(--radius-sm)] hover:bg-secondary/90 link-hover font-semibold"
            >
              {content.cta_secondary_text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to={content.cta_tertiary_url} 
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-[var(--radius-sm)] hover:bg-primary hover:text-primary-foreground link-hover font-semibold"
            >
              {content.cta_tertiary_text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageContent;
