import { Button } from "@/ui/Button";
import { ArrowLeft, Save, Eye, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ProjectEditorHeaderProps {
  isNew: boolean;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  completionPercentage: number;
  publishState?: string;
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
}

export const ProjectEditorHeader = ({
  isNew,
  isLoading,
  isSaving,
  lastSaved,
  completionPercentage,
  publishState = "draft",
  onBack,
  onSave,
  onPreview,
}: ProjectEditorHeaderProps) => {
  const getStatusBadge = () => {
    switch (publishState) {
      case "published":
        return <Badge variant="default" className="bg-green-600">✅ Published</Badge>;
      case "archived":
        return <Badge variant="secondary">📦 Archived</Badge>;
      default:
        return <Badge variant="outline">📝 Draft</Badge>;
    }
  };
  return (
    <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {isNew ? "New Project" : "Edit Project"}
                </h1>
                {!isNew && getStatusBadge()}
              </div>
              <div className="flex items-center gap-3 mt-1">
                {/* Completion Status */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="relative w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-300",
                        completionPercentage === 100 ? "bg-green-500" : "bg-primary"
                      )}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground">
                    {completionPercentage}% complete
                  </span>
                  {completionPercentage === 100 && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                {/* Last Saved */}
                {lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isSaving ? "Saving..." : `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isNew && (
              <Button variant="outline" onClick={onPreview} type="button">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              onClick={onSave} 
              disabled={isLoading || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading || isSaving ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </div>
        
        {/* Keyboard Shortcuts Hint */}
        <div className="mt-2 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded">S</kbd> to save
        </div>
      </div>
    </header>
  );
};
