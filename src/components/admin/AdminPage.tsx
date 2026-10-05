import { AdminPageLayout, type AdminPageLayoutProps } from "./AdminPageLayout";
/** Shared admin template; the old name stays compatible for existing screens. */
export const AdminPage = (props: AdminPageLayoutProps) => (
  <AdminPageLayout {...props} />
);
