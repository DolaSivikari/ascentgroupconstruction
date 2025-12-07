import { Badge } from "@/components/ui/badge";
import { Bell, Mail, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ActivityFeedProps {
  submissions: any[];
  newCount: number;
}

const ActivityFeed = ({ submissions, newCount }: ActivityFeedProps) => {
  const navigate = useNavigate();

  const getSubmissionIcon = (status: string) => {
    if (status === 'new') return <AlertCircle className="h-4 w-4 text-secondary" />;
    if (status === 'contacted') return <Mail className="h-4 w-4 text-blue-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getSubmissionTypeLabel = (type: string) => {
    switch (type) {
      case "quote": return "Quote Request";
      case "estimate": return "Estimate Request";
      case "starter_package": return "Starter Package";
      case "prequal_request": return "Prequalification Request";
      case "resume": return "Resume Submission";
      default: return "General Contact";
    }
  };

  return (
    <div className="business-glass-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="business-section-title">Recent Activity</h3>
            <p className="business-section-subtitle">Latest submissions and updates</p>
          </div>
          {newCount > 0 && (
            <Badge variant="danger" size="sm" icon={Bell}>
              {newCount} New
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6">
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 5).map((submission) => (
              <div
                key={submission.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  submission.status === 'new' ? 'bg-primary/5 border-primary/30' : 'bg-background'
                }`}
                onClick={() => {
                  // Navigate directly to Unified Inbox with proper tab
                  let tab = 'all';
                  if (submission.submission_type === 'prequal_request') tab = 'prequalifications';
                  else if (submission.submission_type === 'resume') tab = 'resume';
                  else if (submission.submission_type === 'quote') tab = 'quote';
                  else if (submission.submission_type === 'rfp') tab = 'rfp';
                  else if (submission.submission_type === 'newsletter') tab = 'newsletter';
                  else tab = 'contact';
                  
                  navigate(`/admin/inbox?tab=${tab}`);
                }}
              >
                <div className={`mt-1 p-2 rounded-full ${
                  submission.status === 'new' ? 'bg-secondary/10' : 'bg-muted'
                }`}>
                  {getSubmissionIcon(submission.status)}
                </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">
                          {submission.name || submission.company_name || submission.applicant_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{submission.email}</p>
                      </div>
                    <Badge variant="outline" size="xs" className="shrink-0">
                      {getSubmissionTypeLabel(submission.submission_type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {submission.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(submission.created_at), 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            ))}
            <button
              className="business-btn business-btn-ghost w-full mt-2"
              onClick={() => navigate("/admin/inbox")}
            >
              View All Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
