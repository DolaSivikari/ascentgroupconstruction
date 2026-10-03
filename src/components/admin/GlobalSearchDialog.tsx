import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, FileText, Folder, Mail, Users, Briefcase } from "lucide-react";
import { searchAdmin, type AdminSearchResult } from "@/lib/adminSearch";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchDialog = ({ open, onOpenChange }: GlobalSearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setResults([]);
    setFailedSources([]);
    const canSearch = open && query.trim().length >= 2;
    setIsSearching(canSearch);
    if (!canSearch) return () => { controller.abort(); };

    const debounce = setTimeout(async () => {
      try {
        const response = await searchAdmin(query, controller.signal);
        if (!active) return;
        setResults(response.results);
        setFailedSources(response.failedSources);
      } catch {
        if (active) setFailedSources(["search"]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(debounce);
      controller.abort();
    };
  }, [open, query, retry]);

  const selectResult = (result: AdminSearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  };
  const icon = (result: AdminSearchResult) => {
    if (result.kind === "blog") return <FileText className="h-4 w-4" />;
    if (result.kind === "project") return <Folder className="h-4 w-4" />;
    if (result.kind === "service") return <Briefcase className="h-4 w-4" />;
    if (["user", "testimonial", "resume"].includes(result.kind)) return <Users className="h-4 w-4" />;
    return <Mail className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Everything</DialogTitle>
          <DialogDescription>Search services, projects, posts, users, and every inbox request type.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input aria-label="Search admin content and inquiries" placeholder="Type at least 2 characters..." maxLength={200} value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" autoFocus />
        </div>
        {failedSources.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              <span>Could not search: {failedSources.join(", ")}. Retry to include those sources.</span>
              <Button size="sm" variant="outline" onClick={() => setRetry((value) => value + 1)}>Retry search</Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-2 max-h-[400px] overflow-y-auto space-y-2" aria-live="polite">
          {isSearching ? <p className="text-center py-8 text-muted-foreground" role="status">Searching...</p> : results.length > 0 ? results.map((result) => (
            <button key={`${result.kind}-${result.id}`} onClick={() => selectResult(result)} className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded">{icon(result)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1"><p className="font-medium truncate">{result.title}</p><Badge variant="outline" className="text-xs">{result.label}</Badge></div>
                  {result.description && <p className="text-sm text-muted-foreground truncate">{result.description}</p>}
                </div>
              </div>
            </button>
          )) : failedSources.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{query.trim().length >= 2 ? `No results found for “${query.trim()}”` : "Start typing to search..."}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
