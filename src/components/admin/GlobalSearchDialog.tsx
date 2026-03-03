import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Folder, Mail, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  description?: string;
  url: string;
}

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchDialog = ({ open, onOpenChange }: GlobalSearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const searchContent = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const searchResults: SearchResult[] = [];

      try {
        // Search blog posts
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("id, title, summary, slug")
          .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
          .limit(5);

        posts?.forEach(post => {
          searchResults.push({
            id: post.id,
            title: post.title,
            type: "Blog Post",
            description: post.summary,
            url: `/admin/blog/${post.id}`,
          });
        });

        // Search projects
        const { data: projects } = await supabase
          .from("projects")
          .select("id, title, summary, slug")
          .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
          .limit(5);

        projects?.forEach(project => {
          searchResults.push({
            id: project.id,
            title: project.title,
            type: "Project",
            description: project.summary,
            url: `/admin/projects/${project.id}`,
          });
        });

        // Search contact submissions
        const { data: contacts } = await supabase
          .from("contact_submissions")
          .select("id, name, email, message")
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5);

        contacts?.forEach(contact => {
          searchResults.push({
            id: contact.id,
            title: contact.name,
            type: "Contact",
            description: contact.email,
            url: "/admin/inbox",
          });
        });

        // Search users
        const { data: users } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5);

        users?.forEach(user => {
          searchResults.push({
            id: user.id,
            title: user.full_name || user.email,
            type: "User",
            description: user.email,
            url: "/admin/users",
          });
        });

        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Blog Post": return <FileText className="h-4 w-4" />;
      case "Project": return <Folder className="h-4 w-4" />;
      case "Contact": return <Mail className="h-4 w-4" />;
      case "User": return <Users className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Everything</DialogTitle>
          <DialogDescription>
            Search across all content, users, and submissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
          {isSearching ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          ) : results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{result.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Start typing to search...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
