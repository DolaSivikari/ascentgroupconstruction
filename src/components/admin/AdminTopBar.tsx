import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { ExternalLink, Home, LogOut, RefreshCw } from "lucide-react";
import ascentLogoHorizontalDark from "@/assets/ascent-logo-horizontal-dark.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { bustCache } from "@/utils/cacheBuster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "./NotificationBell";

export const AdminTopBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/auth");
  };

  const handleViewSite = () => {
    window.open("/", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <img src={ascentLogoHorizontalDark} alt="Ascent Group Construction" width={160} height={40} className="h-10" />
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ascent Group Construction
              </h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={handleViewSite}
              className="gap-2"
              aria-label="View public website"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View Site</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                bustCache();
                toast({
                  title: "Cache Cleared",
                  description: "Site cache has been refreshed successfully",
                });
              }}
              className="gap-2"
              aria-label="Force refresh site cache"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/hero")}
              className="gap-2"
              aria-label="Edit homepage content"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Homepage</span>
            </Button>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
