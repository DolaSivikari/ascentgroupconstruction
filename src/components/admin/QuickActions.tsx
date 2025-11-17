import { useState, useEffect } from "react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Briefcase, Image, Users, Search, Activity, ExternalLink, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_ROUTES } from "@/utils/routeHelpers";

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { label: "New Project", icon: "Briefcase", path: "/admin/projects/new", color: "text-primary" },
  { label: "New Blog Post", icon: "FileText", path: "/admin/blog/new", color: "text-secondary" },
  { label: "Media Library", icon: "Image", path: ADMIN_ROUTES.media, color: "text-blue-600" },
  { label: "Manage Users", icon: "Users", path: ADMIN_ROUTES.users, color: "text-purple-600" },
  { label: "SEO Dashboard", icon: "Search", path: ADMIN_ROUTES.seoDashboard, color: "text-green-600" },
  { label: "View Site", icon: "ExternalLink", path: "/", color: "text-orange-600" },
];

const ICON_MAP: Record<string, any> = {
  FileText, Briefcase, Image, Users, Search, Activity, ExternalLink, Settings
};

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actions, setActions] = useState<QuickAction[]>(DEFAULT_ACTIONS);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadQuickActions();
  }, []);

  const loadQuickActions = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('admin_quick_actions')
        .eq('is_active', true)
        .single();

      if (!error && Array.isArray(data?.admin_quick_actions) && data.admin_quick_actions.length > 0) {
        setActions(data.admin_quick_actions as any as QuickAction[]);
      } else {
        setActions(DEFAULT_ACTIONS);
      }
    } catch (e) {
      // Use defaults if no custom settings found
    }
  };

  const saveQuickActions = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ admin_quick_actions: actions as any })
        .eq('is_active', true);

      if (error) throw error;

      toast({
        title: "Quick Actions Updated",
        description: "Your shortcuts have been saved.",
      });
      setIsEditDialogOpen(false);
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to save Quick Actions settings.",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = (path: string) => {
    if (path === "/" || path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Your most-used shortcuts</CardDescription>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Edit Quick Actions">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Quick Actions</DialogTitle>
              <DialogDescription>
                Manage your shortcuts. Changes will be saved to your profile.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Quick Actions customization coming soon. Current shortcuts:
              </p>
              <ul className="text-sm space-y-2">
                {actions.map((action, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-medium">{action.label}</span>
                    <span className="text-muted-foreground">→ {action.path}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setIsEditDialogOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = ICON_MAP[action.icon] || Briefcase;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="justify-start h-auto py-4 hover:bg-muted hover:border-primary transition-all"
                onClick={() => handleNavigate(action.path)}
                aria-label={`${action.label} - Navigate to ${action.path}`}
              >
                <IconComponent className={`h-5 w-5 mr-3 ${action.color}`} />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
