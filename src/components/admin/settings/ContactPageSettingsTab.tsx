import { COMPANY_PHONE, COMPANY_EMAIL } from "@/constants/company";
import { notifySettingsSaved } from "@/lib/publicSettings";
import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/Card";
import { toast } from "sonner";
import { adminErrorMessage, nullableInteger } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SettingsRecordState } from "./SettingsRecordState";
import { Save } from "lucide-react";

export const ContactPageSettingsTab = () => {
  const {
    data: settings,
    loading,
    error,
    refetch,
  } = useSettingsData("contact_page_settings", "*");
  const [formData, setRawFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const guard = useUnsavedChanges({ hasUnsavedChanges: dirty });
  const setFormData = (value: typeof formData) => {
    setRawFormData(value);
    setDirty(true);
  };

  useEffect(() => {
    if (settings) {
      setRawFormData({
        office_address: settings.office_address || "",

        weekday_hours: settings.weekday_hours || "",
        saturday_hours: settings.saturday_hours || "",
        sunday_hours: settings.sunday_hours || "",
        map_embed_url: settings.map_embed_url || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      const { data: savedRow, error } = await supabase
        .from("contact_page_settings")
        .update(formData)
        .eq("id", settings.id)
        .select("id")
        .single();

      if (error) throw error;
      if (!savedRow)
        throw new Error("The saved settings could not be verified.");
      setDirty(false);
      guard.markSaved();
      notifySettingsSaved("contact_page_settings");

      toast.success("Contact page settings saved successfully");
      void refetch();
    } catch (error) {
      toast.error("Settings could not be saved: " + adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading || error || !settings)
    return (
      <SettingsRecordState
        table="contact_page_settings"
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    );

  return (
    <>
      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={guard.cancelNavigation}
        onConfirm={guard.confirmNavigation}
        title="Unsaved changes"
        description={guard.message}
        confirmText="Leave"
        cancelText="Stay"
      />
      <fieldset disabled={saving} className="min-w-0">
        {" "}
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
                <Label htmlFor="contact_page_settings-office_address">
                  Office Address
                </Label>
                <Textarea
                  id="contact_page_settings-office_address"
                  value={formData.office_address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, office_address: e.target.value })
                  }
                  placeholder="123 Main St, Suite 100, City, State 12345"
                  rows={2}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Phone: {COMPANY_PHONE}. Email: {COMPANY_EMAIL}. Set in code
                (spam protection). Ask a developer to change.
              </p>

              <div>
                <h3 className="font-semibold mb-3">Business Hours</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="contact_page_settings-weekday_hours">
                      Weekday Hours
                    </Label>
                    <Input
                      id="contact_page_settings-weekday_hours"
                      value={formData.weekday_hours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weekday_hours: e.target.value,
                        })
                      }
                      placeholder="Monday-Friday: 8:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_page_settings-saturday_hours">
                      Saturday Hours
                    </Label>
                    <Input
                      id="contact_page_settings-saturday_hours"
                      value={formData.saturday_hours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          saturday_hours: e.target.value,
                        })
                      }
                      placeholder="Saturday: 9:00 AM - 4:00 PM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_page_settings-sunday_hours">
                      Sunday Hours
                    </Label>
                    <Input
                      id="contact_page_settings-sunday_hours"
                      value={formData.sunday_hours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sunday_hours: e.target.value,
                        })
                      }
                      placeholder="Closed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="contact_page_settings-map_embed_url">
                  Google Maps Embed URL
                </Label>
                <Textarea
                  id="contact_page_settings-map_embed_url"
                  value={formData.map_embed_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, map_embed_url: e.target.value })
                  }
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
      </fieldset>
    </>
  );
};
