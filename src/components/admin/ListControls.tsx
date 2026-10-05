import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
export function ListControls({
  search,
  onSearch,
  status,
  onStatus,
  sort,
  onSort,
}: {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        className="max-w-sm"
        aria-label="Search content"
        placeholder="Search titles"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      <select
        className="border rounded-lg bg-background px-3 py-2"
        aria-label="Filter publication status"
        value={status}
        onChange={(event) => onStatus(event.target.value)}
      >
        <option value="all">All statuses</option>
        <option value="published">Published / Active</option>
        <option value="draft">Draft / Inactive</option>
        <option value="archived">Archived</option>
      </select>
      <select
        className="border rounded-lg bg-background px-3 py-2"
        aria-label="Sort content"
        value={sort}
        onChange={(event) => onSort(event.target.value)}
      >
        <option value="updated">Recently updated</option>
        <option value="title">Title A–Z</option>
      </select>
    </div>
  );
}
export function ListPagination({
  page,
  pages,
  count,
  onPage,
}: {
  page: number;
  pages: number;
  count: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </Button>
      <span>
        Page {page} of {Math.max(1, pages)} · {count} items
      </span>
      <Button
        variant="outline"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
