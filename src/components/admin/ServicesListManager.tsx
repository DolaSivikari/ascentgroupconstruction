import { ContentRowActions } from "./ContentRowActions";
import { ListControls, ListPagination } from "./ListControls";
import { useContentList } from "@/hooks/useContentList";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServicesAdmin } from "@/hooks/useServicesAdmin";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const ServicesListManager = () => {
  const { services, isLoading, error, refetch, deleteService } =
    useServicesAdmin();
  const queryClient = useQueryClient();
  const list = useContentList(services);
  const navigate = useNavigate();
  const [serviceToDelete, setServiceToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading services...</div>;
  }

  if (error)
    return (
      <div role="alert" className="space-y-3">
        <p>Could not load services: {error.message}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  return (
    <div className="space-y-4">
      <ListControls
        search={list.search}
        onSearch={list.setSearch}
        status={list.status}
        onStatus={list.setStatus}
        sort={list.sort}
        onSort={list.setSort}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => navigate("/admin/services/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-2">
        {list.count === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No services found</p>
            <Button onClick={() => navigate("/admin/services/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Service
            </Button>
          </div>
        ) : (
          list.rows.map((service) => (
            <div
              key={service.id}
              className="flex flex-wrap gap-3 items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              {service.featured_image && (
                <img
                  src={service.featured_image}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg mr-3"
                  loading="lazy"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  Updated{" "}
                  {service.updated_at
                    ? new Date(service.updated_at).toLocaleDateString()
                    : "date not recorded"}
                </p>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{service.name}</h3>
                  {service.category && (
                    <Badge variant="secondary">{service.category}</Badge>
                  )}
                  <Badge
                    variant={
                      service.publish_state === "published"
                        ? "default"
                        : service.publish_state === "scheduled"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {service.publish_state || "draft"}
                  </Badge>
                  {service.featured && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </div>
                {service.short_description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.short_description.substring(0, 100)}...
                  </p>
                )}
              </div>
              <ContentRowActions
                table="services"
                id={service.id}
                title={service.name}
                slug={service.slug}
                state={service.publish_state || "draft"}
                onDelete={() =>
                  setServiceToDelete({ id: service.id, name: service.name })
                }
                onDone={() => {
                  void queryClient.invalidateQueries({
                    queryKey: ["services-admin"],
                  });
                }}
              />
            </div>
          ))
        )}
      </div>
      <ListPagination
        page={list.page}
        pages={list.pages}
        count={list.count}
        onPage={list.setPage}
      />
      <ConfirmDialog
        open={!!serviceToDelete}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null);
        }}
        onConfirm={() => {
          if (serviceToDelete && !deleteService.isPending)
            deleteService.mutate(serviceToDelete.id);
        }}
        title="Delete Service"
        description={`Delete “${serviceToDelete?.name}”? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};
