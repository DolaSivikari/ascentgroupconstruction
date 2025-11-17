import { AdminPageHeader } from './AdminPageHeader';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export const AdminPageLayout = ({
  title,
  description,
  backTo,
  backLabel,
  actions,
  loading,
  children,
}: AdminPageLayoutProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-6 pt-6">
        <AdminPageHeader
          title={title}
          description={description}
          backTo={backTo}
          backLabel={backLabel}
          actions={actions}
          loading={loading}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
};
