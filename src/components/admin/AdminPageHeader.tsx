import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const AdminPageHeader = ({
  title,
  description,
  backTo,
  backLabel = 'Back to Dashboard',
  actions,
  loading = false,
  icon,
}: AdminPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 space-y-3">
      {backTo && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backTo)}
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="business-page-title flex items-center gap-3">
            {icon}
            <span className="truncate">{title}</span>
          </h1>
          {description && (
            <p className="business-page-subtitle mt-1">
              {description}
            </p>
          )}
          {loading && (
            <div className="mt-2 text-sm text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
