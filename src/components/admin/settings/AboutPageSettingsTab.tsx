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

export const AboutPageSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("about_page_settings");
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        story_headline: settings.story_headline || "",
        story_promise_title: settings.story_promise_title || "",
        story_promise_text: settings.story_promise_text || "",
        sustainability_headline: settings.sustainability_headline || "",
        sustainability_commitment: settings.sustainability_commitment || "",
        safety_headline: settings.safety_headline || "",
        safety_commitment: settings.safety_commitment || "",
        years_in_business: settings.years_in_business || 15,
        total_projects: settings.total_projects || 500,
        satisfaction_rate: settings.satisfaction_rate || 98,
        cta_headline: settings.cta_headline || "",
        cta_subheadline: settings.cta_subheadline || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("about_page_settings")
        .update(formData)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast.success("About page settings saved successfully");
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
        <CardTitle>About Page Configuration</CardTitle>
        <CardDescription>
          Manage company story, values, sustainability, and safety information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Company Story</h3>
            <div className="space-y-3">
              <div>
                <Label>Story Headline</Label>
                <Input
                  value={formData.story_headline || ""}
                  onChange={(e) => setFormData({ ...formData, story_headline: e.target.value })}
                  placeholder="Our Story"
                />
              </div>
              <div>
                <Label>Promise Title</Label>
                <Input
                  value={formData.story_promise_title || ""}
                  onChange={(e) => setFormData({ ...formData, story_promise_title: e.target.value })}
                  placeholder="Our Promise"
                />
              </div>
              <div>
                <Label>Promise Text</Label>
                <Textarea
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
                <Label>Sustainability Headline</Label>
                <Input
                  value={formData.sustainability_headline || ""}
                  onChange={(e) => setFormData({ ...formData, sustainability_headline: e.target.value })}
                  placeholder="Sustainability Commitment"
                />
              </div>
              <div>
                <Label>Sustainability Commitment</Label>
                <Textarea
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
                <Label>Safety Headline</Label>
                <Input
                  value={formData.safety_headline || ""}
                  onChange={(e) => setFormData({ ...formData, safety_headline: e.target.value })}
                  placeholder="Safety First, Always"
                />
              </div>
              <div>
                <Label>Safety Commitment</Label>
                <Textarea
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
                <Label>Years in Business</Label>
                <Input
                  type="number"
                  value={formData.years_in_business || ""}
                  onChange={(e) => setFormData({ ...formData, years_in_business: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Total Projects</Label>
                <Input
                  type="number"
                  value={formData.total_projects || ""}
                  onChange={(e) => setFormData({ ...formData, total_projects: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Satisfaction Rate (%)</Label>
                <Input
                  type="number"
                  value={formData.satisfaction_rate || ""}
                  onChange={(e) => setFormData({ ...formData, satisfaction_rate: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Call to Action</h3>
            <div className="space-y-3">
              <div>
                <Label>CTA Headline</Label>
                <Input
                  value={formData.cta_headline || ""}
                  onChange={(e) => setFormData({ ...formData, cta_headline: e.target.value })}
                  placeholder="Ready to Work with Us?"
                />
              </div>
              <div>
                <Label>CTA Subheadline</Label>
                <Input
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
  );
};
