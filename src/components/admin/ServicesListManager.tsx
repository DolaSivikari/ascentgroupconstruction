import { useState } from "react";
import { useServicesAdmin } from "@/hooks/useServicesAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ServicesListManager = () => {
  const { services, isLoading, deleteService } = useServicesAdmin();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service: any) =>
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
        <Button onClick={() => navigate("/admin/services-manager/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-2">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No services found</p>
            <Button onClick={() => navigate("/admin/services-manager/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Service
            </Button>
          </div>
        ) : (
          filteredServices.map((service: any) => (
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
                  onClick={() => navigate(`/admin/services-manager/${service.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this service?")) {
                      deleteService.mutate(service.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
