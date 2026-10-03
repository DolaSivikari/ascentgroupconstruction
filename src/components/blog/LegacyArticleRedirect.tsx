import { Navigate, useLocation, useParams } from "react-router-dom";

/** Preserve shared preview parameters while resolving the legacy article alias. */
export function LegacyArticleRedirect() {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return (
    <Navigate
      to={`/blog/${encodeURIComponent(slug || "")}${search}${hash}`}
      replace
    />
  );
}
