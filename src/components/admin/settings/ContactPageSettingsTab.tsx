import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const ContactPageSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("contact_page_settings");
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        office_address: settings.office_address || "",
        main_phone: settings.main_phone || "",
        toll_free_phone: settings.toll_free_phone || "",
        general_email: settings.general_email || "",
        projects_email: settings.projects_email || "",
        careers_email: settings.careers_email || "",
        rfp_email: settings.rfp_email || "",
        weekday_hours: settings.weekday_hours || "",
        saturday_hours: settings.saturday_hours || "",
        sunday_hours: settings.sunday_hours || "",
        map_embed_url: settings.map_embed_url || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("contact_page_settings")
        .update(formData)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast.success("Contact page settings saved successfully");
      refetch();
    } catch (error: any) {
      toast.error("Failed to save settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Page Configuration</CardTitle>
        <CardDescription>
          Manage office locations, contact details, and business hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <Label>Office Address</Label>
            <Textarea
              value={formData.office_address || ""}
              onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
              placeholder="123 Main St, Suite 100, City, State 12345"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Main Phone</Label>
              <Input
                value={formData.main_phone || ""}
                onChange={(e) => setFormData({ ...formData, main_phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label>Toll-Free Phone</Label>
              <Input
                value={formData.toll_free_phone || ""}
                onChange={(e) => setFormData({ ...formData, toll_free_phone: e.target.value })}
                placeholder="1-800-123-4567"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Email Addresses</h3>
            <div className="space-y-3">
              <div>
                <Label>General Inquiries</Label>
                <Input
                  type="email"
                  value={formData.general_email || ""}
                  onChange={(e) => setFormData({ ...formData, general_email: e.target.value })}
                  placeholder="info@company.com"
                />
              </div>
              <div>
                <Label>Projects</Label>
                <Input
                  type="email"
                  value={formData.projects_email || ""}
                  onChange={(e) => setFormData({ ...formData, projects_email: e.target.value })}
                  placeholder="projects@company.com"
                />
              </div>
              <div>
                <Label>RFP Submissions</Label>
                <Input
                  type="email"
                  value={formData.rfp_email || ""}
                  onChange={(e) => setFormData({ ...formData, rfp_email: e.target.value })}
                  placeholder="rfp@company.com"
                />
              </div>
              <div>
                <Label>Careers</Label>
                <Input
                  type="email"
                  value={formData.careers_email || ""}
                  onChange={(e) => setFormData({ ...formData, careers_email: e.target.value })}
                  placeholder="careers@company.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Business Hours</h3>
            <div className="space-y-3">
              <div>
                <Label>Weekday Hours</Label>
                <Input
                  value={formData.weekday_hours || ""}
                  onChange={(e) => setFormData({ ...formData, weekday_hours: e.target.value })}
                  placeholder="Monday-Friday: 8:00 AM - 6:00 PM"
                />
              </div>
              <div>
                <Label>Saturday Hours</Label>
                <Input
                  value={formData.saturday_hours || ""}
                  onChange={(e) => setFormData({ ...formData, saturday_hours: e.target.value })}
                  placeholder="Saturday: 9:00 AM - 4:00 PM"
                />
              </div>
              <div>
                <Label>Sunday Hours</Label>
                <Input
                  value={formData.sunday_hours || ""}
                  onChange={(e) => setFormData({ ...formData, sunday_hours: e.target.value })}
                  placeholder="Closed"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Google Maps Embed URL</Label>
            <Textarea
              value={formData.map_embed_url || ""}
              onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
              placeholder="https://www.google.com/maps/embed?..."
              rows={2}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
