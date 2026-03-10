import { FileText, Briefcase, Image, Users, Search, Activity, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  { label: "Media Library", icon: "Image", path: ADMIN_ROUTES.media, color: "text-[hsl(var(--steel-blue))]" },
  { label: "Manage Users", icon: "Users", path: ADMIN_ROUTES.users, color: "text-primary" },
  { label: "SEO Dashboard", icon: "Search", path: ADMIN_ROUTES.seoDashboard, color: "text-[hsl(var(--steel-blue))]" },
  { label: "View Site", icon: "ExternalLink", path: "/", color: "text-accent" },
];

const ICON_MAP: Record<string, any> = {
  FileText, Briefcase, Image, Users, Search, Activity, ExternalLink, Settings
};

const QuickActions = () => {
  const navigate = useNavigate();
  const [actions] = useState<QuickAction[]>(DEFAULT_ACTIONS);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleNavigate = (path: string) => {
    if (path === "/" || path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="business-glass-card">
      <div className="p-6 flex flex-row items-center justify-between border-b border-border">
        <div>
          <h3 className="business-section-title">Quick Actions</h3>
          <p className="business-section-subtitle">Your most-used shortcuts</p>
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
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = ICON_MAP[action.icon] || Briefcase;
            return (
              <button
                key={action.label}
                className="business-btn business-btn-ghost justify-start h-auto py-4"
                onClick={() => handleNavigate(action.path)}
                aria-label={`${action.label} - Navigate to ${action.path}`}
              >
                <IconComponent className={`h-5 w-5 mr-3 ${action.color}`} />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
