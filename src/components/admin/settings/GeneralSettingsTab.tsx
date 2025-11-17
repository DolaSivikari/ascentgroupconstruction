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

export const GeneralSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("site_settings");
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || "",
        company_tagline: settings.company_tagline || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        founded_year: settings.founded_year || 2009,
        meta_title: settings.meta_title || "",
        meta_description: settings.meta_description || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update(formData)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast.success("Settings saved successfully");
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
        <CardTitle>General Site Settings</CardTitle>
        <CardDescription>
          Configure basic company information and site-wide defaults
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div>
            <Label>Company Name</Label>
            <Input
              value={formData.company_name || ""}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
          </div>

          <div>
            <Label>Company Tagline</Label>
            <Input
              value={formData.company_tagline || ""}
              onChange={(e) => setFormData({ ...formData, company_tagline: e.target.value })}
              placeholder="Your complete construction partner..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@company.com"
              />
            </div>
          </div>

          <div>
            <Label>Business Address</Label>
            <Textarea
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              rows={2}
            />
          </div>

          <div>
            <Label>Founded Year</Label>
            <Input
              type="number"
              value={formData.founded_year || ""}
              onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Default SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Default Meta Title</Label>
                <Input
                  value={formData.meta_title || ""}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Company Name - Tagline"
                />
              </div>
              <div>
                <Label>Default Meta Description</Label>
                <Textarea
                  value={formData.meta_description || ""}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Brief description of your business..."
                  rows={3}
                />
              </div>
            </div>
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
