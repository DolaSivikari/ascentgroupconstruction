import { useState } from "react";
import { useServicesAdmin } from "@/hooks/useServicesAdmin";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const ServicesListManager = () => {
  const { services, isLoading, deleteService } = useServicesAdmin();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-muted-foreground">Loading services...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => navigate("/admin/services/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-2">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No services found</p>
            <Button onClick={() => navigate("/admin/services/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Service
            </Button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
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
              <div className="flex items-center gap-2">
                {service.publish_state === "published" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/services/${service.slug}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/services/${service.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteService.isPending}
                  aria-label={`Delete ${service.name}`}
                  onClick={() => setServiceToDelete({ id: service.id, name: service.name })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog
        open={!!serviceToDelete}
        onOpenChange={(open) => { if (!open) setServiceToDelete(null); }}
        onConfirm={() => { if (serviceToDelete && !deleteService.isPending) deleteService.mutate(serviceToDelete.id); }}
        title="Delete Service"
        description={`Delete “${serviceToDelete?.name}”? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};
