import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { generatePreviewToken } from "@/utils/previewToken";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const BlogPosts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin]);

  const loadPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      loadPosts();
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "secondary";
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleViewPost = (post: any) => {
    if (post.publish_state === 'published') {
      window.open(`/blog/${post.slug}`, '_blank');
    } else {
      const token = generatePreviewToken();
      window.open(`/blog/${post.slug}?preview=true&token=${token}`, '_blank');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="business-page-title">Blog Posts</h1>
          <p className="business-page-subtitle">Manage articles and case studies</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="case-study">Case Studies</SelectItem>
            </SelectContent>
          </Select>
          <Button className="business-btn-primary" onClick={() => navigate("/admin/blog/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading blog posts...</div>
      ) : posts.length === 0 ? (
        <div className="business-glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No blog posts yet. Create your first post to get started.</p>
          <Button className="business-btn-primary" onClick={() => navigate("/admin/blog/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Blog Post
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts
            .filter(post => contentTypeFilter === "all" || post.content_type === contentTypeFilter)
            .map((post) => (
            <div key={post.id} className="business-glass-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <Badge variant={getStatusColor(post.publish_state)}>
                      {post.publish_state}
                    </Badge>
                    {post.content_type === "case-study" && (
                      <Badge variant="outline">Case Study</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{post.summary || post.seo_description}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {post.category && (
                      <span>Category: {post.category}</span>
                    )}
                    {post.read_time_minutes && (
                      <span>{post.read_time_minutes} min read</span>
                    )}
                    {post.published_at && (
                      <span>Published: {format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                    )}
                    {post.created_at && !post.published_at && (
                      <span>Created: {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPost(post)}
                    title={post.publish_state === 'published' ? 'View published post' : 'Preview draft'}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/blog/${post.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};

export default BlogPosts;
