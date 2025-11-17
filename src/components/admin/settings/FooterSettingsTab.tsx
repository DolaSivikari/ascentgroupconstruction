import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const FooterSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("footer_settings");
  const [formData, setFormData] = useState<any>({
    social_media: {},
    contact_info: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        social_media: settings.social_media || {},
        contact_info: settings.contact_info || {},
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("footer_settings")
        .update(formData)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast.success("Footer settings saved successfully");
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
        <CardTitle>Footer Configuration</CardTitle>
        <CardDescription>
          Manage footer links, social media, and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Social Media Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={formData.social_media?.facebook || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, facebook: e.target.value } })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label>Twitter</Label>
                <Input
                  value={formData.social_media?.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, twitter: e.target.value } })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={formData.social_media?.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={formData.social_media?.instagram || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, instagram: e.target.value } })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Footer Contact Info</h3>
            <div className="space-y-4">
              <div>
                <Label>Phone (Display)</Label>
                <Input
                  value={formData.contact_info?.phone || ""}
                  onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, phone: e.target.value } })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Email (Display)</Label>
                <Input
                  value={formData.contact_info?.email || ""}
                  onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, email: e.target.value } })}
                  placeholder="info@company.com"
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
