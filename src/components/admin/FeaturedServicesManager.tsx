import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFeaturedServicesAdmin } from "@/hooks/useFeaturedServices";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export function FeaturedServicesManager() {
  const { allFeaturedServices, isLoading, createFeaturedService, updateFeaturedService, deleteFeaturedService } = useFeaturedServicesAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [newService, setNewService] = useState({
    service_name: '',
    service_link: '',
    icon_name: 'Building2',
    display_order: 0,
    category: '',
    description: '',
    promotion_badge: '',
  });

  const handleCreate = () => {
    if (!newService.service_name || !newService.service_link) {
      toast.error('Please fill in required fields');
      return;
    }

    createFeaturedService(newService);
    setIsCreating(false);
    setNewService({
      service_name: '',
      service_link: '',
      icon_name: 'Building2',
      display_order: 0,
      category: '',
      description: '',
      promotion_badge: '',
    });
    toast.success('Featured service created!');
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateFeaturedService({
      id,
      updates: { is_active: !currentStatus },
    });
    toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this featured service?')) {
      deleteFeaturedService(id);
      toast.success('Featured service deleted');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Services Manager
            </CardTitle>
            <CardDescription>
              Manage services displayed in the mobile navigation
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <h3 className="font-semibold">New Featured Service</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Service Name *</Label>
                <Input
                  value={newService.service_name}
                  onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                  placeholder="e.g., Building Envelope"
                />
              </div>
              <div>
                <Label>Service Link *</Label>
                <Input
                  value={newService.service_link}
                  onChange={(e) => setNewService({ ...newService, service_link: e.target.value })}
                  placeholder="/services/building-envelope"
                />
              </div>
              <div>
                <Label>Icon Name</Label>
                <Input
                  value={newService.icon_name}
                  onChange={(e) => setNewService({ ...newService, icon_name: e.target.value })}
                  placeholder="Building2"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={newService.display_order}
                  onChange={(e) => setNewService({ ...newService, display_order: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  placeholder="Building Envelope"
                />
              </div>
              <div>
                <Label>Promotion Badge</Label>
                <Input
                  value={newService.promotion_badge}
                  onChange={(e) => setNewService({ ...newService, promotion_badge: e.target.value })}
                  placeholder="New!"
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {allFeaturedServices?.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{service.service_name}</h4>
                  {service.promotion_badge && (
                    <Badge variant="secondary" className="text-xs">
                      {service.promotion_badge}
                    </Badge>
                  )}
                  <Badge variant={service.is_active ? "default" : "secondary"} className="text-xs">
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{service.service_link}</p>
                {service.description && (
                  <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Order: {service.display_order}</span>
                <Switch
                  checked={service.is_active}
                  onCheckedChange={() => handleToggleActive(service.id, service.is_active)}
                />
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
