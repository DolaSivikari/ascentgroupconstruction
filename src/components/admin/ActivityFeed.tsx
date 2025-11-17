import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest submissions and updates</CardDescription>
          </div>
          {newCount > 0 && (
            <Badge variant="danger" size="sm" icon={Bell}>
              {newCount} New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
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
                  if (submission.submission_type === 'prequal_request') {
                    navigate("/admin/prequalifications");
                  } else if (submission.submission_type === 'resume') {
                    navigate("/admin/resume-submissions");
                  } else {
                    navigate("/admin/contacts");
                  }
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
            <Button
              variant="outline"
              className="w-full mt-2 hover:bg-primary hover:text-[hsl(var(--bg))] transition-colors"
              onClick={() => navigate("/admin/contacts")}
            >
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
