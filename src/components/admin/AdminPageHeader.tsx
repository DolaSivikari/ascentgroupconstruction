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
}

export const AdminPageHeader = ({
  title,
  description,
  backTo = '/admin',
  backLabel = 'Back to Dashboard',
  actions,
  loading = false,
}: AdminPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backTo)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
        {loading && (
          <div className="mt-2 text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};
