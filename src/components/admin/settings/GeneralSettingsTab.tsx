import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminErrorMessage, nullableInteger } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SettingsRecordState } from "./SettingsRecordState";
import { Save, Globe, Building, Mail } from "lucide-react";

export const GeneralSettingsTab = () => {
  const { data: settings, loading, error, refetch } = useSettingsData("site_settings", "*");
  const [formData, setRawFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const guard = useUnsavedChanges({ hasUnsavedChanges: dirty });
  const setFormData = (value: typeof formData) => { setRawFormData(value); setDirty(true); };

  useEffect(() => {
    if (settings) {
      const socialLinks = settings.social_links as Record<string, string> | null;
      setRawFormData({
        company_name: settings.company_name || "",
        company_tagline: settings.company_tagline || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        founded_year: settings.founded_year ?? "",
        meta_title: settings.meta_title || "",
        meta_description: settings.meta_description || "",
        // Social links
        social_linkedin: socialLinks?.linkedin || "",
        social_facebook: socialLinks?.facebook || "",
        social_instagram: socialLinks?.instagram || "",
        social_twitter: socialLinks?.twitter || "",
        social_youtube: socialLinks?.youtube || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      const updateData = {
        company_name: formData.company_name,
        company_tagline: formData.company_tagline,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        founded_year: nullableInteger(formData.founded_year, "Founded year"),
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        social_links: {
          linkedin: formData.social_linkedin,
          facebook: formData.social_facebook,
          instagram: formData.social_instagram,
          twitter: formData.social_twitter,
          youtube: formData.social_youtube,
        },
      };

      const { data: savedRow, error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", settings.id).select("id").single();

      if (error) throw error;
      if (!savedRow) throw new Error("The saved settings could not be verified.");
      setDirty(false);
      guard.markSaved();
      
      toast.success("Settings saved successfully");
      void refetch();
    } catch (error) {
      toast.error("Settings could not be saved: " + adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading || error || !settings) return <SettingsRecordState table="site_settings" loading={loading} error={error} onRetry={refetch} />;

  return (
    <>
    <ConfirmDialog open={guard.showDialog} onOpenChange={guard.cancelNavigation} onConfirm={guard.confirmNavigation} title="Unsaved changes" description={guard.message} confirmText="Leave" cancelText="Stay" />
    <fieldset disabled={saving} className="min-w-0">    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details displayed across the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_settings-company_name">Company Name</Label>
              <Input
                id="site_settings-company_name"
                value={formData.company_name || ""}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="site_settings-founded_year">Founded Year</Label>
              <Input
                id="site_settings-founded_year"
                type="number"
                value={formData.founded_year || ""}
                onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="site_settings-company_tagline">Company Tagline</Label>
            <Input
                id="site_settings-company_tagline"
              value={formData.company_tagline || ""}
              onChange={(e) => setFormData({ ...formData, company_tagline: e.target.value })}
              placeholder="Your complete construction partner..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_settings-phone">Phone Number</Label>
              <Input
                id="site_settings-phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(647) 528-6804"
              />
            </div>
            <div>
              <Label htmlFor="site_settings-email">Email Address</Label>
              <Input
                id="site_settings-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@company.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="site_settings-address">Business Address</Label>
            <Textarea
                id="site_settings-address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Media Links
          </CardTitle>
          <CardDescription>
            Social media profiles displayed in footer and contact pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_settings-social_linkedin">LinkedIn</Label>
              <Input
                id="site_settings-social_linkedin"
                value={formData.social_linkedin || ""}
                onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <Label htmlFor="site_settings-social_facebook">Facebook</Label>
              <Input
                id="site_settings-social_facebook"
                value={formData.social_facebook || ""}
                onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="site_settings-social_instagram">Instagram</Label>
              <Input
                id="site_settings-social_instagram"
                value={formData.social_instagram || ""}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="site_settings-social_twitter">Twitter / X</Label>
              <Input
                id="site_settings-social_twitter"
                value={formData.social_twitter || ""}
                onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label htmlFor="site_settings-social_youtube">YouTube</Label>
              <Input
                id="site_settings-social_youtube"
                value={formData.social_youtube || ""}
                onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Default SEO Settings
          </CardTitle>
          <CardDescription>
            Default meta tags used when page-specific SEO is not set
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site_settings-meta_title">Default Meta Title</Label>
            <Input
                id="site_settings-meta_title"
              value={formData.meta_title || ""}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Company Name - Tagline"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.meta_title?.length || 0}/60 characters
            </p>
          </div>
          <div>
            <Label htmlFor="site_settings-meta_description">Default Meta Description</Label>
            <Textarea
                id="site_settings-meta_description"
              value={formData.meta_description || ""}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Brief description of your business..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.meta_description?.length || 0}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
    </fieldset>
    </>
  );
};
