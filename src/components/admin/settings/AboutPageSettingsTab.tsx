import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { toast } from "sonner";
import { adminErrorMessage, nullableInteger } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SettingsRecordState } from "./SettingsRecordState";
import { Save } from "lucide-react";

export const AboutPageSettingsTab = () => {
  const { data: settings, loading, error, refetch } = useSettingsData("about_page_settings", "*");
  const [formData, setRawFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const guard = useUnsavedChanges({ hasUnsavedChanges: dirty });
  const setFormData = (value: typeof formData) => { setRawFormData(value); setDirty(true); };

  useEffect(() => {
    if (settings) {
      setRawFormData({
        story_headline: settings.story_headline || "",
        story_promise_title: settings.story_promise_title || "",
        story_promise_text: settings.story_promise_text || "",
        sustainability_headline: settings.sustainability_headline || "",
        sustainability_commitment: settings.sustainability_commitment || "",
        safety_headline: settings.safety_headline || "",
        safety_commitment: settings.safety_commitment || "",
        years_in_business: settings.years_in_business ?? "",
        total_projects: settings.total_projects ?? "",
        satisfaction_rate: settings.satisfaction_rate ?? "",
        cta_headline: settings.cta_headline || "",
        cta_subheadline: settings.cta_subheadline || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      const { data: savedRow, error } = await supabase
        .from("about_page_settings")
        .update({ ...formData, years_in_business: nullableInteger(formData.years_in_business, "Years in business"), total_projects: nullableInteger(formData.total_projects, "Total projects"), satisfaction_rate: nullableInteger(formData.satisfaction_rate, "Satisfaction rate") })
        .eq("id", settings.id).select("id").single();

      if (error) throw error;
      if (!savedRow) throw new Error("The saved settings could not be verified.");
      setDirty(false);
      guard.markSaved();
      
      toast.success("About page settings saved successfully");
      void refetch();
    } catch (error) {
      toast.error("Settings could not be saved: " + adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading || error || !settings) return <SettingsRecordState table="about_page_settings" loading={loading} error={error} onRetry={refetch} />;

  return (
    <>
    <ConfirmDialog open={guard.showDialog} onOpenChange={guard.cancelNavigation} onConfirm={guard.confirmNavigation} title="Unsaved changes" description={guard.message} confirmText="Leave" cancelText="Stay" />
    <fieldset disabled={saving} className="min-w-0">    <Card>
      <CardHeader>
        <CardTitle>About Page Configuration</CardTitle>
        <CardDescription>
          These saved settings do not change the public About page yet. The next
          upgrade will connect the About page editor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Company Story</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="about_page_settings-story_headline">Story Headline</Label>
                <Input
                id="about_page_settings-story_headline"
                  value={formData.story_headline || ""}
                  onChange={(e) => setFormData({ ...formData, story_headline: e.target.value })}
                  placeholder="Our Story"
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-story_promise_title">Promise Title</Label>
                <Input
                id="about_page_settings-story_promise_title"
                  value={formData.story_promise_title || ""}
                  onChange={(e) => setFormData({ ...formData, story_promise_title: e.target.value })}
                  placeholder="Our Promise"
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-story_promise_text">Promise Text</Label>
                <Textarea
                id="about_page_settings-story_promise_text"
                  value={formData.story_promise_text || ""}
                  onChange={(e) => setFormData({ ...formData, story_promise_text: e.target.value })}
                  placeholder="Our commitment to you..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sustainability</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="about_page_settings-sustainability_headline">Sustainability Headline</Label>
                <Input
                id="about_page_settings-sustainability_headline"
                  value={formData.sustainability_headline || ""}
                  onChange={(e) => setFormData({ ...formData, sustainability_headline: e.target.value })}
                  placeholder="Sustainability Commitment"
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-sustainability_commitment">Sustainability Commitment</Label>
                <Textarea
                id="about_page_settings-sustainability_commitment"
                  value={formData.sustainability_commitment || ""}
                  onChange={(e) => setFormData({ ...formData, sustainability_commitment: e.target.value })}
                  placeholder="Our environmental commitment..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Safety</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="about_page_settings-safety_headline">Safety Headline</Label>
                <Input
                id="about_page_settings-safety_headline"
                  value={formData.safety_headline || ""}
                  onChange={(e) => setFormData({ ...formData, safety_headline: e.target.value })}
                  placeholder="Safety First, Always"
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-safety_commitment">Safety Commitment</Label>
                <Textarea
                id="about_page_settings-safety_commitment"
                  value={formData.safety_commitment || ""}
                  onChange={(e) => setFormData({ ...formData, safety_commitment: e.target.value })}
                  placeholder="Our safety commitment..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Key Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="about_page_settings-years_in_business">Years in Business</Label>
                <Input
                id="about_page_settings-years_in_business"
                  type="number"
                  value={formData.years_in_business ?? ""}
                  onChange={(e) => setFormData({ ...formData, years_in_business: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-total_projects">Total Projects</Label>
                <Input
                id="about_page_settings-total_projects"
                  type="number"
                  value={formData.total_projects ?? ""}
                  onChange={(e) => setFormData({ ...formData, total_projects: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-satisfaction_rate">Satisfaction Rate (%)</Label>
                <Input
                id="about_page_settings-satisfaction_rate"
                  type="number"
                  value={formData.satisfaction_rate ?? ""}
                  onChange={(e) => setFormData({ ...formData, satisfaction_rate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Call to Action</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="about_page_settings-cta_headline">CTA Headline</Label>
                <Input
                id="about_page_settings-cta_headline"
                  value={formData.cta_headline || ""}
                  onChange={(e) => setFormData({ ...formData, cta_headline: e.target.value })}
                  placeholder="Ready to Work with Us?"
                />
              </div>
              <div>
                <Label htmlFor="about_page_settings-cta_subheadline">CTA Subheadline</Label>
                <Input
                id="about_page_settings-cta_subheadline"
                  value={formData.cta_subheadline || ""}
                  onChange={(e) => setFormData({ ...formData, cta_subheadline: e.target.value })}
                  placeholder="Get in touch today"
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
