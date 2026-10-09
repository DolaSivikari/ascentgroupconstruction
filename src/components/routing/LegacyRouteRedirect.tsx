import { Navigate, useLocation } from "react-router-dom";

/** Keep campaign attribution and section anchors when an old public URL moves. */
export function LegacyRouteRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: to, search, hash }} replace />;
}
