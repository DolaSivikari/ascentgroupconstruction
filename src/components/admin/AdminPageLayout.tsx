import { createContext, useContext } from "react";
const AdminPageContext = createContext(false);
import { AdminPageHeader } from "./AdminPageHeader";

export interface AdminPageLayoutProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  filters?: React.ReactNode;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
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
  filters,
  error,
  empty = false,
  emptyMessage = "No records yet.",
}: AdminPageLayoutProps) => {
  const nested = useContext(AdminPageContext);
  if (nested)
    return (
      <div className="space-y-4">
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        {children}
      </div>
    );
  return (
    <AdminPageContext.Provider value={true}>
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
          {filters}
          {error ? (
            <p role="alert" className="rounded-lg border p-4 text-destructive">
              {error}
            </p>
          ) : empty ? (
            <p className="rounded-lg border p-6 text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
    </AdminPageContext.Provider>
  );
};
