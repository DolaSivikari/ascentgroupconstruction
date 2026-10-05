import { useState } from "react";
export function useContentList<
  T extends {
    title?: string;
    name?: string;
    publish_state?: string | null;
    is_active?: boolean;
    updated_at?: string | null;
    created_at?: string | null;
  },
>(rows: T[]) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const filtered = rows
    .filter(
      (row) =>
        (row.title || row.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (status === "all" ||
          (row.publish_state || (row.is_active ? "published" : "draft")) ===
            status),
    )
    .sort((left, right) =>
      sort === "title"
        ? (left.title || left.name || "").localeCompare(
            right.title || right.name || "",
          )
        : (right.updated_at || right.created_at || "").localeCompare(
            left.updated_at || left.created_at || "",
          ),
    );
  const pages = Math.ceil(filtered.length / 25);
  const safePage = Math.min(page, Math.max(1, pages));
  return {
    search,
    status,
    sort,
    page: safePage,
    pages,
    count: filtered.length,
    rows: filtered.slice((safePage - 1) * 25, safePage * 25),
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    setStatus: (value: string) => {
      setStatus(value);
      setPage(1);
    },
    setSort: (value: string) => {
      setSort(value);
      setPage(1);
    },
    setPage,
  };
}
