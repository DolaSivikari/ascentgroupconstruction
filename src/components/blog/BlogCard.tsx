import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText } from "lucide-react";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    summary?: string;
    excerpt?: string;
    published_at?: string;
    date?: string;
    category: string;
    featured_image?: string;
    image?: string;
    author?: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  const date = post.published_at || post.date || new Date().toISOString();
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const excerpt = post.summary || post.excerpt || '';
  const image = post.featured_image || post.image || '';

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card variant="interactive" className="h-full overflow-hidden group border-2 hover:border-primary">
        <CardContent className="p-8">
          <div className="flex items-start gap-3 mb-4">
            <Badge variant="info" size="sm" icon={FileText} className="shrink-0">{post.category}</Badge>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary link-hover leading-tight">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
