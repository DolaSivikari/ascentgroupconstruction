import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, Briefcase, Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'service' | 'project' | 'blog' | 'contact' | 'resume' | 'testimonial';
  title: string;
  description?: string;
  url: string;
  icon: typeof FileText;
}

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQuery = `%${query}%`;
        
        const [services, projects, blogs, contacts, resumes, testimonials] = await Promise.all([
          supabase.from('services' as any).select('id, name, short_description').ilike('name', searchQuery).limit(5) as any,
          supabase.from('projects' as any).select('id, title, description').ilike('title', searchQuery).limit(5) as any,
          supabase.from('blog_posts' as any).select('id, title, summary').ilike('title', searchQuery).limit(5) as any,
          supabase.from('contact_submissions' as any).select('id, name, email, company').ilike('name', searchQuery).limit(5) as any,
          supabase.from('resume_submissions' as any).select('id, full_name, email, position_applied').ilike('full_name', searchQuery).limit(5) as any,
          supabase.from('testimonials' as any).select('id, author_name, company_name, quote').ilike('author_name', searchQuery).limit(5) as any
        ]);

        const allResults: SearchResult[] = [
          ...(services.data || []).map(s => ({
            id: s.id,
            type: 'service' as const,
            title: s.name,
            description: s.short_description,
            url: `/admin/services/${s.id}`,
            icon: Briefcase
          })),
          ...(projects.data || []).map(p => ({
            id: p.id,
            type: 'project' as const,
            title: p.title,
            description: p.description,
            url: `/admin/projects/${p.id}`,
            icon: Briefcase
          })),
          ...(blogs.data || []).map(b => ({
            id: b.id,
            type: 'blog' as const,
            title: b.title,
            description: b.summary,
            url: `/admin/blog/${b.id}`,
            icon: FileText
          })),
          ...(contacts.data || []).map(c => ({
            id: c.id,
            type: 'contact' as const,
            title: c.name,
            description: `${c.email}${c.company ? ` - ${c.company}` : ''}`,
            url: `/admin/contacts`,
            icon: Mail
          })),
          ...(resumes.data || []).map(r => ({
            id: r.id,
            type: 'resume' as const,
            title: r.full_name,
            description: `${r.position_applied} - ${r.email}`,
            url: `/admin/resumes`,
            icon: Users
          })),
          ...(testimonials.data || []).map(t => ({
            id: t.id,
            type: 'testimonial' as const,
            title: t.author_name,
            description: t.company_name,
            url: `/admin/testimonials`,
            icon: Users
          }))
        ];

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground h-9"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, projects, blog posts, contacts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            {loading && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {result.type}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}

            {query.length < 2 && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
