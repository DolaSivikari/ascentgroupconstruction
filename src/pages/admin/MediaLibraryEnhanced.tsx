import { useSearchParams } from "react-router-dom";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { MediaBrowser } from "@/components/admin/MediaBrowser";
export default function MediaLibraryEnhanced() {
  const [params] = useSearchParams();
  return (
    <AdminPageLayout
      title="Media"
      description="Images in project-images, with reference checks before deleting"
    >
      <MediaBrowser
        manage
        initialFolder={params.get("folder") || ""}
        initialSearch={params.get("search") || ""}
      />
    </AdminPageLayout>
  );
}
