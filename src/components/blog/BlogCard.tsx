import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { Link } from "react-router-dom";
import { Card } from "@/design-system/components/Card";
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
    year: 'numeric',
  });

  const excerpt = post.summary || post.excerpt || '';
  const readTime = excerpt ? Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 200)) : 3;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block group h-full"
    >
      <Card
        variant="interactive"
        size="md"
        className="h-full flex flex-col transition-shadow duration-300 group-hover:shadow-[var(--shadow-card-hover)]"
      >
        <div className="flex items-start gap-3 mb-4 flex-wrap">
          <Badge variant="info" size="sm" icon={FileText} className="shrink-0">
            {post.category}
          </Badge>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
        <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} mb-3 group-hover:text-primary transition-colors`}>
          {post.title}
        </h3>
        <p className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground line-clamp-3 flex-grow`}>
          {excerpt}
        </p>
      </Card>
    </Link>
  );
};

export default BlogCard;
