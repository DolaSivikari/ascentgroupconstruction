import { Navigate, useLocation } from "react-router-dom";

export default function EstimatesQuotes() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set("tab", "leads");
  params.set("type", "commercial");
  if (params.get("id") && !params.get("highlight"))
    params.set("highlight", params.get("id")!);
  if (params.get("highlight")) params.set("source", "quote");
  return (
    <Navigate
      replace
      to={{
        pathname: "/admin/inbox",
        search: `?${params}`,
        hash: location.hash,
      }}
    />
  );
}
