import { Navigate, useLocation } from "react-router-dom";
import type { InboxKind } from "@/lib/inbox/model";

/** Keep bookmarked submission references when moving old screens into the inbox. */
export const LegacyInboxRedirect = ({ kind }: { kind?: InboxKind }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (kind) params.set("tab", kind);
  const selectedId = params.get("id");
  if (selectedId && !params.get("highlight")) params.set("highlight", selectedId);
  const search = params.toString();
  return <Navigate to={{ pathname: "/admin/inbox", search: search ? `?${search}` : "", hash: location.hash }} replace />;
};
