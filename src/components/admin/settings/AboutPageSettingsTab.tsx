import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { toast } from "sonner";
import { Save } from "lucide-react";

const DEFAULTS = {
  story_headline: "Our Story",
  story_promise_title: "Our Promise",
  story_promise_text: "",
  sustainability_headline: "Sustainability Commitment",
  sustainability_commitment: "",
  safety_headline: "Safety First, Always",
  safety_commitment: "",
  years_in_business: 1,
  total_projects: 0,
  satisfaction_rate: 100,
  cta_headline: "Ready to Work with Us?",
  cta_subheadline: "Get in touch today",
};

export const AboutPageSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("about_page_settings");
  const [formData, setFormData] = useState<any>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        story_headline: settings.story_headline ?? DEFAULTS.story_headline,
        story_promise_title: settings.story_promise_title ?? DEFAULTS.story_promise_title,
        story_promise_text: settings.story_promise_text ?? "",
        sustainability_headline: settings.sustainability_headline ?? DEFAULTS.sustainability_headline,
        sustainability_commitment: settings.sustainability_commitment ?? "",
        safety_headline: settings.safety_headline ?? DEFAULTS.safety_headline,
        safety_commitment: settings.safety_commitment ?? "",
        years_in_business: settings.years_in_business ?? DEFAULTS.years_in_business,
        total_projects: settings.total_projects ?? DEFAULTS.total_projects,
        satisfaction_rate: settings.satisfaction_rate ?? DEFAULTS.satisfaction_rate,
        cta_headline: settings.cta_headline ?? DEFAULTS.cta_headline,
        cta_subheadline: settings.cta_subheadline ?? DEFAULTS.cta_subheadline,
      });
    }
  }, [settings]);

  const set = (key: string, value: any) => setFormData((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings?.id) {
        // Row exists — update it
        const { error } = await supabase
          .from("about_page_settings")
          .update(formData)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        // No row — insert one with is_active: true
        const { error } = await supabase
          .from("about_page_settings")
          .insert({ ...formData, is_active: true });
        if (error) throw error;
      }
      toast.success("About page settings saved");
      refetch();
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center text-muted-foreground text-sm">
          Loading settings…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page</CardTitle>
        <CardDescription>
          {settings
            ? "Edit your company story, safety, and sustainability content."
            : "No settings row found — fill in the form below and save to create one."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Company Story */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Company Story</h3>
          <div className="grid gap-4">
            <div>
              <Label>Story Headline</Label>
              <Input
                value={formData.story_headline}
                onChange={e => set("story_headline", e.target.value)}
                placeholder="Our Story"
              />
            </div>
            <div>
              <Label>Promise Title</Label>
              <Input
                value={formData.story_promise_title}
                onChange={e => set("story_promise_title", e.target.value)}
                placeholder="Our Promise"
              />
            </div>
            <div>
              <Label>Promise Text</Label>
              <Textarea
                value={formData.story_promise_text}
                onChange={e => set("story_promise_text", e.target.value)}
                placeholder="Our commitment to you…"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Sustainability</h3>
          <div className="grid gap-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={formData.sustainability_headline}
                onChange={e => set("sustainability_headline", e.target.value)}
                placeholder="Sustainability Commitment"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.sustainability_commitment}
                onChange={e => set("sustainability_commitment", e.target.value)}
                placeholder="Our environmental commitment…"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Safety</h3>
          <div className="grid gap-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={formData.safety_headline}
                onChange={e => set("safety_headline", e.target.value)}
                placeholder="Safety First, Always"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.safety_commitment}
                onChange={e => set("safety_commitment", e.target.value)}
                placeholder="Our safety commitment…"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Key Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Years in Business</Label>
              <Input
                type="number"
                min={0}
                value={formData.years_in_business}
                onChange={e => set("years_in_business", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Total Projects</Label>
              <Input
                type="number"
                min={0}
                value={formData.total_projects}
                onChange={e => set("total_projects", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Satisfaction Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.satisfaction_rate}
                onChange={e => set("satisfaction_rate", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Call to Action</h3>
          <div className="grid gap-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={formData.cta_headline}
                onChange={e => set("cta_headline", e.target.value)}
                placeholder="Ready to Work with Us?"
              />
            </div>
            <div>
              <Label>Subheadline</Label>
              <Input
                value={formData.cta_subheadline}
                onChange={e => set("cta_subheadline", e.target.value)}
                placeholder="Get in touch today"
              />
            </div>
          </div>
        </section>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : settings ? "Save Changes" : "Create Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
