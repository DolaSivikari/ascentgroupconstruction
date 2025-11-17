import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Calendar, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "../OptimizedImage";
import { supabase } from "@/integrations/supabase/client";
import { resolveAssetPath } from "@/utils/assetResolver";
import { useCarousel } from "@/hooks/useCarousel";

const categories = ["All", "Case Studies", "Industry Insights", "Technical", "News"];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  featured_image: string;
  published_at: string;
  content_type?: string;
  project_location?: string;
  project_duration?: string;
  project_size?: string;
}

const ContentHub = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const carousel = useCarousel({ 
    totalItems: 0, // Will be set when posts load
    autoplayInterval: 0,
    itemsPerView: 3
  });

  useEffect(() => {
    const loadPosts = async () => {
      const today = new Date().toISOString();
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, summary, category, featured_image, published_at, content_type, project_location, project_duration, project_size')
        .eq('publish_state', 'published')
        .lte('published_at', today)
        .order('published_at', { ascending: false })
        .limit(7);
      
      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };
    
    loadPosts();
  }, []);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1, 7);

  const filteredPosts = activeCategory === "All" 
    ? regularPosts 
    : regularPosts.filter(post => 
        post.category.toLowerCase().includes(activeCategory.toLowerCase())
      );

  if (loading) {
    return (
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        
        {/* Section Header - Enterprise Style */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Industry Insights & Project Updates
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Expert knowledge, technical insights, and project highlights from our construction team
          </p>
        </div>

        {/* Category Filter - Clean Minimal Design */}
        <div className="flex flex-wrap gap-3 mb-12 pb-8 border-b border-border">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200
                ${activeCategory === category 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post - Large Professional Layout */}
        {featuredPost && (
          <Link to={`/blog/${featuredPost.slug}`} className="block mb-16">
            <Card className="overflow-hidden group border-border hover:[box-shadow:var(--shadow-card-elevated)] card-hover">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image - 3 columns */}
                <div className="relative md:col-span-3 h-80 md:h-[500px] overflow-hidden bg-muted">
                  <OptimizedImage
                    src={resolveAssetPath(featuredPost.featured_image) || featuredPost.featured_image}
                    alt={featuredPost.title}
                    width={1200}
                    height={800}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent"></div>
                </div>

                {/* Content - 2 columns */}
                <CardContent className="md:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-background">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-1 w-12 bg-steel-blue"></div>
                    <span className="text-xs font-bold text-steel-blue uppercase tracking-wider">
                      Featured Article
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-8 line-clamp-3 text-base md:text-lg leading-relaxed">
                    {featuredPost.summary}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-steel-blue" />
                      <span>
                        {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-steel-blue" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-primary font-semibold text-base group-hover:gap-4 transition-all">
                    Read Article
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}

        {/* Post Grid - Horizontal Carousel */}
        <div className="relative">
          <div className="flex items-center justify-end gap-2 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carousel.prev()}
              disabled={!carousel.canGoPrev}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carousel.next()}
              disabled={!carousel.canGoNext}
              className="h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-hidden mb-12">
            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-transform duration-500 ease-out"
              style={{ 
                transform: window.innerWidth < 768 
                  ? `translateX(-${carousel.currentIndex * 100}%)` 
                  : 'none' 
              }}
            >
              {filteredPosts.map((post) => {
                const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <Card className="h-full overflow-hidden border-border hover:[box-shadow:var(--shadow-card-elevated)] hover-lift">
                      <div className="relative h-56 overflow-hidden bg-muted">
                        <OptimizedImage
                          src={resolveAssetPath(post.featured_image) || post.featured_image}
                          alt={post.title}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-semibold text-steel-blue uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed">
                          {post.summary}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-steel-blue font-semibold pt-4 border-t border-border">
                          Read More
                          <ArrowRight className="h-4 w-4 hover-translate-arrow" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA - Professional Design */}
        <div className="text-center pt-8">
          <Button asChild variant="secondary" size="lg" className="min-w-[200px]">
            <Link to="/blog" className="inline-flex items-center gap-2">
              View All Insights
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentHub;
