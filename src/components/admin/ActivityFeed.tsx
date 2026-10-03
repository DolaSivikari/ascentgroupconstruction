import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Bell, Mail, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  inboxDate,
  inboxName,
  inboxText,
  type InboxItem,
} from "@/lib/inbox/model";
import { activityDestination } from "@/lib/inbox/dashboard";

interface ActivityFeedProps {
  submissions: InboxItem[];
  newCount: number;
  loading?: boolean;
  failed?: string[];
  onRetry?: () => void;
}
const ActivityFeed = ({
  submissions,
  newCount,
  loading,
  failed = [],
  onRetry,
}: ActivityFeedProps) => {
  const navigate = useNavigate();
  return (
    <div className="business-glass-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="business-section-title">Recent Activity</h3>
            <p className="business-section-subtitle">
              Latest submissions across all inquiry types
            </p>
          </div>
          {newCount > 0 && (
            <Badge variant="danger" size="sm" icon={Bell}>
              {newCount} New
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6">
        {failed.length > 0 && (
          <div role="alert" className="mb-4 text-sm text-destructive">
            Could not load {failed.join(", ")} activity.{" "}
            <Button variant="outline" size="sm" onClick={onRetry}>
              Retry activity
            </Button>
          </div>
        )}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {failed.length ? "Activity is incomplete." : "No recent activity"}
          </p>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 5).map((item) => {
              const received = inboxDate(item.created_at);
              const preview = [
                "scope_of_work",
                "message",
                "additional_notes",
                "cover_letter",
              ]
                .map((field) => inboxText(item, field))
                .find(Boolean);
              return (
                <button
                  type="button"
                  key={`${item.table}:${item.id}`}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors ${item.status === "new" ? "bg-primary/5 border-primary/30" : "bg-background"}`}
                  onClick={() => navigate(activityDestination(item))}
                >
                  <div
                    className={`mt-1 p-2 rounded-full ${item.status === "new" ? "bg-secondary/10" : "bg-muted"}`}
                  >
                    {item.status === "new" ? (
                      <AlertCircle className="h-4 w-4 text-secondary" />
                    ) : item.status === "contacted" ? (
                      <Mail className="h-4 w-4 text-info" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {inboxName(item)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.email}
                        </p>
                      </div>
                      <Badge variant="outline" size="xs" className="shrink-0">
                        {item.type === "Quote" && item.source === "estimator"
                          ? "Estimate"
                          : item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {preview}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {received
                        ? format(received, "MMM d, h:mm a")
                        : "Date unavailable"}
                    </div>
                  </div>
                </button>
              );
            })}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/inbox")}
            >
              View All Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ActivityFeed;
