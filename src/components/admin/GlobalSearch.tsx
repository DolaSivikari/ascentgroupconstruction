import { useState, useEffect } from "react";
import { Button } from "@/ui/Button";
import { Search } from "lucide-react";
import { GlobalSearchDialog } from "./GlobalSearchDialog";

export const GlobalSearch = ({ collapsed = false }: { collapsed?: boolean }) => {
  const [open, setOpen] = useState(false);

  // The active admin layout keeps this component mounted even when its sidebar collapses.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && !event.repeat) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      {collapsed ? (
        <button className="admin-nav-item is-collapsed admin-sidebar-search-collapsed" title="Search (Ctrl/Cmd+K)" onClick={() => setOpen(true)} aria-label="Search admin content and inquiries">
          <span className="admin-nav-item__icon"><Search size={18} strokeWidth={1.75} /></span>
        </button>
      ) : (
        <Button variant="outline" className="w-full justify-start text-sm text-muted-foreground h-9" onClick={() => setOpen(true)}>
          <Search className="mr-2 h-4 w-4" />Search...
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">Ctrl/⌘ K</kbd>
        </Button>
      )}
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
