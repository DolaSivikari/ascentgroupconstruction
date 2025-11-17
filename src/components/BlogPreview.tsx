import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { resolveAssetPath } from "@/utils/assetResolver";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: string;
  featured_image: string;
  published_at: string;
}

const BlogPreview = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('slug, title, summary, category, featured_image, published_at')
        .eq('publish_state', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (data) {
        setFeaturedPosts(data);
      }
    };
    
    loadPosts();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert tips, industry knowledge, and project inspiration from our team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {featuredPosts.slice(0, 1).map((post) => {
            const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="md:col-span-3">
                <Card variant="featured" className="h-full overflow-hidden group">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <OptimizedImage
                        src={resolveAssetPath(post.featured_image) || post.featured_image}
                        alt={`${post.title} - Expert guide on ${post.category.toLowerCase()}`}
                        width={1200}
                        height={800}
                        className="w-full h-full hover-scale"
                        objectFit="cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="info" size="sm" icon={FileText}>{post.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-lg line-clamp-3">
                        {post.summary}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {featuredPosts.slice(1, 3).map((post) => {
            const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

              return (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card variant="interactive" className="h-full overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={resolveAssetPath(post.featured_image) || post.featured_image}
                      alt={`${post.title} - Expert guide on ${post.category.toLowerCase()}`}
                      width={800}
                      height={600}
                      className="w-full h-full hover-scale"
                      objectFit="cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="info" size="sm" icon={FileText}>{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.summary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">
              View All Articles <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
