import { AdminPageHeader } from './AdminPageHeader';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminPageLayout = ({
  title,
  description,
  backTo,
  backLabel,
  actions,
  loading,
  icon,
  children,
}: AdminPageLayoutProps) => {
  return (
    <div className="admin-page-shell">
      <AdminPageHeader
        title={title}
        description={description}
        backTo={backTo}
        backLabel={backLabel}
        actions={actions}
        loading={loading}
        icon={icon}
      />
      <div className="admin-page-body">
        {children}
      </div>
    </div>
  );
};
