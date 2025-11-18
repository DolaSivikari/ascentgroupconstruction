import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionChecklistProps {
  completion: {
    tabs: Record<string, {
      total: number;
      completed: number;
      percentage: number;
      missing: string[];
    }>;
    overall: {
      total: number;
      completed: number;
      percentage: number;
    };
    isComplete: boolean;
  };
}

const tabLabels: Record<string, string> = {
  basic: "Basic Info",
  images: "Images",
  details: "Project Details",
  services: "Services & Scope",
  metrics: "GC Metrics",
  seo: "SEO & Publishing",
};

const fieldLabels: Record<string, string> = {
  title: "Project Title",
  slug: "URL Slug",
  summary: "Summary",
  category: "Category",
  featured_image: "Featured Image",
  year: "Completion Year",
  project_size: "Project Size",
  service_ids: "Services",
  seo_title: "SEO Title",
  seo_description: "SEO Description",
  publish_state: "Publication Status",
};

export const CompletionChecklist = ({ completion }: CompletionChecklistProps) => {
  return (
    <Card className="p-4 sticky top-24">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Publish Checklist</h3>
          <div className="flex items-center gap-2">
            {completion.isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {completion.overall.completed}/{completion.overall.total}
            </span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall Progress</span>
            <span>{completion.overall.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                completion.isComplete ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${completion.overall.percentage}%` }}
            />
          </div>
        </div>

        {/* Tab Breakdown */}
        <div className="space-y-3 border-t pt-3">
          {Object.entries(completion.tabs).map(([tabKey, tabData]) => {
            const isComplete = tabData.percentage === 100;
            const hasRequired = tabData.total > 0;
            
            if (!hasRequired) return null;

            return (
              <div key={tabKey} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">
                      {tabLabels[tabKey]}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isComplete ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {tabData.completed}/{tabData.total}
                  </span>
                </div>
                
                {!isComplete && tabData.missing.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {tabData.missing.map(field => (
                      <div key={field} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Circle className="w-2 h-2" />
                        {fieldLabels[field] || field}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {completion.isComplete && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-xs text-green-900 dark:text-green-100">
              ✓ All required fields are complete! Ready to publish.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
