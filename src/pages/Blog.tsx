import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { Button } from "@/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/heroes/hero-about-company.jpg";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  featured_image: string;
  published_at: string;
  author_id: string | null;
  content_type?: string;
  project_location?: string;
  project_duration?: string;
  project_size?: string;
}

const Blog = () => {
  const [filter, setFilter] = useState<string>("all");
  const [visiblePosts, setVisiblePosts] = React.useState(6);
  const [animatedCards, setAnimatedCards] = React.useState<Set<number>>(new Set());
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPosts = async () => {
      const today = new Date().toISOString();
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, summary, category, featured_image, published_at, author_id, content_type, project_location, project_duration, project_size')
        .eq('publish_state', 'published')
        .lte('published_at', today)
        .order('published_at', { ascending: false });
      
      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };
    
    loadPosts();
  }, []);

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category)))];
  
  // Featured section (top 3)
  const featuredPosts = posts.slice(0, 3);
  
  // All content section (exclude featured posts to avoid duplication)
  const allContentPosts = posts.slice(3);
  
  const filteredPosts = filter === "all" 
    ? allContentPosts 
    : allContentPosts.filter(p => p.category === filter);

  const loadMore = () => {
    setVisiblePosts(prev => Math.min(prev + 6, filteredPosts.length));
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setAnimatedCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('.blog-card-animate').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filteredPosts]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Construction Insights | Envelope & Restoration Contractor"
        description="Expert insights on building envelope restoration, façade remediation, parking garage restoration, and real-world case studies showcasing successful specialty projects from Ascent Group Construction."
        keywords="envelope restoration blog, facade remediation tips, building envelope guides, parking garage restoration, waterproofing insights, construction case studies, specialty contractor projects"
      />
      <Navigation />
      
      {loading ? (
        <div className="container mx-auto px-4 py-20 text-center"><div className="animate-pulse">Loading content...</div></div>
      ) : (
      <main className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10" />
        <PageHeader
          title="Blog & Case Studies"
          description="Expert insights, success stories, and real-world projects from industry professionals"
          backgroundImage={heroImage}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog & Case Studies" }
          ]}
          variant="standard"
        />

        {/* Enhanced Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-4 py-20 border-b">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-4">Featured Content</h2>
              <p className="text-lg text-muted-foreground">Latest insights and success stories from our team</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className="blog-card-animate transition-all duration-600 opacity-100 hover-scale" data-index={index} style={{ animationDelay: `${index * 100}ms` }}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced All Posts with Filter */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">All Content</h2>
            <p className="text-lg text-muted-foreground">Browse our complete library of articles and case studies</p>
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="mb-12 flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-[var(--radius-sm)]">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize rounded-[var(--radius-sm)] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {category === "all" ? "All Posts" : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={filter} className="mt-0">
              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                      <div
                        key={post.id}
                        className={`blog-card-animate card-hover ${
                          animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        data-index={index}
                        style={{ transitionDelay: `${(index % 6) * 100}ms` }}
                      >
                        <BlogCard post={post} />
                      </div>
                    ))}
                  </div>
                  
                  {visiblePosts < filteredPosts.length && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={loadMore}
                        size="lg"
                        variant="outline"
                        className="hover:bg-secondary hover:text-primary hover:border-secondary card-hover"
                      >
                        Load More Articles
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found in this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Newsletter Signup */}
        <NewsletterSection />
      </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Blog;
