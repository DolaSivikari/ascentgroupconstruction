import { ContentRowActions } from "@/components/admin/ContentRowActions";
import { ListControls, ListPagination } from "@/components/admin/ListControls";
import { useContentList } from "@/hooks/useContentList";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { savePreviewLink } from "@/lib/admin/contentPreview";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";

const BlogPosts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  const list = useContentList(
    posts.filter(
      (post) =>
        contentTypeFilter === "all" || post.content_type === contentTypeFilter,
    ),
  );

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin]);

  const loadPosts = async () => {
    setIsLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError("Could not load blog posts. " + error.message);
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
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "secondary";
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

  const handleViewPost = async (post: {
    id: string;
    slug: string;
    publish_state: string;
  }) => {
    try {
      const url =
        post.publish_state === "published"
          ? `/blog/${post.slug}`
          : await savePreviewLink("blog_posts", post.id, post.slug);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Preview unavailable",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <AdminPageLayout
      error={loadError}
      title="Blog Posts"
      description="Manage articles and case studies"
      actions={
        <>
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="case-study">Case Studies</SelectItem>
            </SelectContent>
          </Select>
          <button
            className="business-btn business-btn-primary"
            onClick={() => navigate("/admin/blog/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
        </>
      }
    >
      <ListControls
        search={list.search}
        onSearch={list.setSearch}
        status={list.status}
        onStatus={list.setStatus}
        sort={list.sort}
        onSort={list.setSort}
      />
      {isLoading ? (
        <div className="text-center py-12">Loading blog posts...</div>
      ) : posts.length === 0 ? (
        <div
          className="business-glass-card text-center"
          style={{ padding: "3rem" }}
        >
          <p
            className="mb-4"
            style={{ color: "var(--business-text-secondary)" }}
          >
            No blog posts yet. Create your first post to get started.
          </p>
          <button
            className="business-btn business-btn-primary"
            onClick={() => navigate("/admin/blog/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Blog Post
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {list.rows.map((post) => (
            <div
              key={post.id}
              className="business-glass-card"
              style={{ padding: "1.5rem" }}
            >
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
              )}
              <p className="text-xs text-muted-foreground mb-2">
                Updated{" "}
                {post.updated_at
                  ? new Date(post.updated_at).toLocaleDateString()
                  : "date not recorded"}
              </p>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <Badge variant={getStatusColor(post.publish_state)}>
                      {post.publish_state}
                    </Badge>
                    {post.content_type === "case-study" && (
                      <Badge variant="info">Case Study</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {post.summary || post.seo_description}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {post.category && <span>Category: {post.category}</span>}
                    {post.read_time_minutes && (
                      <span>{post.read_time_minutes} min read</span>
                    )}
                    {post.published_at && (
                      <span>
                        Published:{" "}
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                    {post.created_at && !post.published_at && (
                      <span>
                        Created:{" "}
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {post.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <ContentRowActions
                  table="blog_posts"
                  id={post.id}
                  title={post.title}
                  slug={post.slug}
                  state={post.publish_state || "draft"}
                  onDelete={() => handleDeleteClick(post.id)}
                  onDone={() => void loadPosts()}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ListPagination
        page={list.page}
        pages={list.pages}
        count={list.count}
        onPage={list.setPage}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </AdminPageLayout>
  );
};

export default BlogPosts;
