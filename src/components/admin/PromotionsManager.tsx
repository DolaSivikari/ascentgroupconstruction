import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useServicePromotionsAdmin } from "@/hooks/useFeaturedServices";
import { Plus, Megaphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function PromotionsManager() {
  const { allPromotions, isLoading, createPromotion, updatePromotion, deletePromotion } = useServicePromotionsAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    service_link: '',
    promotion_type: 'campaign' as 'seasonal' | 'campaign' | 'urgent' | 'new',
    badge_text: '',
    badge_color: '#FF6600',
    priority: 5,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    promotion_message: '',
    discount_percentage: 0,
  });

  const handleCreate = () => {
    if (!newPromotion.title || !newPromotion.service_link) {
      toast.error('Please fill in required fields');
      return;
    }

    createPromotion({
      ...newPromotion,
      start_date: new Date(newPromotion.start_date).toISOString(),
      end_date: new Date(newPromotion.end_date).toISOString(),
    });
    setIsCreating(false);
    toast.success('Promotion created!');
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updatePromotion({
      id,
      updates: { is_active: !currentStatus },
    });
    toast.success(`Promotion ${!currentStatus ? 'activated' : 'deactivated'}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      deletePromotion(id);
      toast.success('Promotion deleted');
    }
  };

  const promotionTypeColors: Record<string, string> = {
    seasonal: 'bg-blue-600',
    campaign: 'bg-purple-600',
    urgent: 'bg-red-600',
    new: 'bg-green-600',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Service Promotions Manager
            </CardTitle>
            <CardDescription>
              Manage seasonal and campaign-based service promotions
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Promotion
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <h3 className="font-semibold">New Promotion</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                  placeholder="Spring Waterproofing Special"
                />
              </div>
              <div>
                <Label>Service Link *</Label>
                <Input
                  value={newPromotion.service_link}
                  onChange={(e) => setNewPromotion({ ...newPromotion, service_link: e.target.value })}
                  placeholder="/services/waterproofing"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newPromotion.promotion_type}
                  onValueChange={(value: any) => setNewPromotion({ ...newPromotion, promotion_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="new">New Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Badge Text</Label>
                <Input
                  value={newPromotion.badge_text}
                  onChange={(e) => setNewPromotion({ ...newPromotion, badge_text: e.target.value })}
                  placeholder="20% OFF"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newPromotion.start_date}
                  onChange={(e) => setNewPromotion({ ...newPromotion, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newPromotion.end_date}
                  onChange={(e) => setNewPromotion({ ...newPromotion, end_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Priority (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newPromotion.priority}
                  onChange={(e) => setNewPromotion({ ...newPromotion, priority: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Discount %</Label>
                <Input
                  type="number"
                  value={newPromotion.discount_percentage}
                  onChange={(e) => setNewPromotion({ ...newPromotion, discount_percentage: parseInt(e.target.value) })}
                />
              </div>
              <div className="col-span-2">
                <Label>Promotion Message</Label>
                <Input
                  value={newPromotion.promotion_message}
                  onChange={(e) => setNewPromotion({ ...newPromotion, promotion_message: e.target.value })}
                  placeholder="Limited time offer!"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Promotions List */}
        <div className="space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {allPromotions?.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{promo.title}</h4>
                  <Badge className={promotionTypeColors[promo.promotion_type]}>
                    {promo.promotion_type}
                  </Badge>
                  {promo.badge_text && (
                    <Badge variant="outline">{promo.badge_text}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{promo.service_link}</p>
                {promo.promotion_message && (
                  <p className="text-xs text-muted-foreground mt-1">{promo.promotion_message}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Start: {new Date(promo.start_date).toLocaleDateString()}</span>
                  <span>End: {new Date(promo.end_date).toLocaleDateString()}</span>
                  <span>Priority: {promo.priority}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={promo.is_active}
                  onCheckedChange={() => handleToggleActive(promo.id, promo.is_active)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(promo.id)}
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
