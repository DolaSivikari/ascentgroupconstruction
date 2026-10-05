import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Plus, ExternalLink, User } from "lucide-react";
import { Button } from "@/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBellInbox } from "./NotificationBellInbox";
import type { AdminTheme } from "@/lib/admin/preferences";

export function AdminTopBar({
  theme,
  onThemeChange,
  onOpenMenu,
  email,
  onSignOut,
  signingOut,
}: {
  theme: AdminTheme;
  onThemeChange: () => void;
  onOpenMenu: () => void;
  email?: string;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const location = useLocation();
  const label =
    location.pathname.split("/")[2]?.replace(/-/g, " ") || "Dashboard";
  return (
    <header className="admin-topbar flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open admin navigation"
        onClick={onOpenMenu}
      >
        <Menu size={20} />
      </Button>
      <div className="min-w-0 mr-auto">
        <p className="text-xs text-muted-foreground">
          Admin / <span className="capitalize">{label}</span>
        </p>
        <p className="font-semibold capitalize">{label}</p>
      </div>
      <div className="w-9 sm:w-52 admin-topbar-search">
        <GlobalSearch />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden sm:inline-flex">
            <Plus size={16} className="mr-1" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {[
            ["Project", "/admin/projects/new"],
            ["Blog post", "/admin/blog/new"],
            ["Service", "/admin/services/new"],
          ].map(([name, to]) => (
            <DropdownMenuItem key={to} asChild>
              <Link to={to}>{name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationBellInbox />
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        onClick={onThemeChange}
      >
        {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
      </Button>
      <Button asChild variant="outline" className="hidden sm:inline-flex">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} className="mr-2" />
          View site
        </a>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="User menu">
            <User size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-[90vw]">
          <div className="px-2 py-2 text-sm break-all">{email}</div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              View site
            </a>
          </DropdownMenuItem>
          {[
            ["New project", "/admin/projects/new"],
            ["New blog post", "/admin/blog/new"],
            ["New service", "/admin/services/new"],
          ].map(([name, to]) => (
            <DropdownMenuItem key={to} className="sm:hidden" asChild>
              <Link to={to}>{name}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem disabled={signingOut} onSelect={onSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
