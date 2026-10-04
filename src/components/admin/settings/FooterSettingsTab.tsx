import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { toast } from "sonner";
import { adminErrorMessage, nullableInteger } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SettingsRecordState } from "./SettingsRecordState";
import { Save } from "lucide-react";

export const FooterSettingsTab = () => {
  const { data: settings, loading, error, refetch } = useSettingsData("footer_settings", "*");
  const [formData, setRawFormData] = useState<any>({
    social_media: {},
    contact_info: {},
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const guard = useUnsavedChanges({ hasUnsavedChanges: dirty });
  const setFormData = (value: typeof formData) => { setRawFormData(value); setDirty(true); };

  useEffect(() => {
    if (settings) {
      setRawFormData({
        social_media: settings.social_media || {},
        contact_info: settings.contact_info || {},
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      const { data: savedRow, error } = await supabase
        .from("footer_settings")
        .update(formData)
        .eq("id", settings.id).select("id").single();

      if (error) throw error;
      if (!savedRow) throw new Error("The saved settings could not be verified.");
      setDirty(false);
      guard.markSaved();
      
      toast.success("Footer settings saved successfully");
      void refetch();
    } catch (error) {
      toast.error("Settings could not be saved: " + adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading || error || !settings) return <SettingsRecordState table="footer_settings" loading={loading} error={error} onRetry={refetch} />;

  return (
    <>
    <ConfirmDialog open={guard.showDialog} onOpenChange={guard.cancelNavigation} onConfirm={guard.confirmNavigation} title="Unsaved changes" description={guard.message} confirmText="Leave" cancelText="Stay" />
    <fieldset disabled={saving} className="min-w-0">    <Card>
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="footer_settings-social_media">Facebook</Label>
                <Input
                id="footer_settings-social_media"
                  value={formData.social_media?.facebook || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, facebook: e.target.value } })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="footer_settings-social_media">Twitter</Label>
                <Input
                id="footer_settings-social_media"
                  value={formData.social_media?.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, twitter: e.target.value } })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="footer_settings-social_media">LinkedIn</Label>
                <Input
                id="footer_settings-social_media"
                  value={formData.social_media?.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, social_media: { ...formData.social_media, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div>
                <Label htmlFor="footer_settings-social_media">Instagram</Label>
                <Input
                id="footer_settings-social_media"
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
                <Label htmlFor="footer_settings-contact_info">Phone (Display)</Label>
                <Input
                id="footer_settings-contact_info"
                  value={formData.contact_info?.phone || ""}
                  onChange={(e) => setFormData({ ...formData, contact_info: { ...formData.contact_info, phone: e.target.value } })}
                  placeholder="(647) 528-6804"
                />
              </div>
              <div>
                <Label htmlFor="footer_settings-contact_info">Email (Display)</Label>
                <Input
                id="footer_settings-contact_info"
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
    </fieldset>
    </>
  );
};
