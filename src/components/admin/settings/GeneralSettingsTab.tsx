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
import { Save, Globe, Building, Mail } from "lucide-react";

export const GeneralSettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("site_settings");
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      const socialLinks = settings.social_links as Record<string, string> | null;
      setFormData({
        company_name: settings.company_name || "",
        company_tagline: settings.company_tagline || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        founded_year: settings.founded_year || 2025,
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
    setSaving(true);
    try {
      const updateData = {
        company_name: formData.company_name,
        company_tagline: formData.company_tagline,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        founded_year: formData.founded_year,
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

      const { error } = await supabase
        .from("site_settings")
        .update(updateData)
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

  if (loading) return <div className="flex items-center justify-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
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
              <Label>Company Name</Label>
              <Input
                value={formData.company_name || ""}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
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
          </div>

          <div>
            <Label>Company Tagline</Label>
            <Input
              value={formData.company_tagline || ""}
              onChange={(e) => setFormData({ ...formData, company_tagline: e.target.value })}
              placeholder="Your complete construction partner..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(647) 528-6804"
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
              <Label>LinkedIn</Label>
              <Input
                value={formData.social_linkedin || ""}
                onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input
                value={formData.social_facebook || ""}
                onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={formData.social_instagram || ""}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label>Twitter / X</Label>
              <Input
                value={formData.social_twitter || ""}
                onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input
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
            <Label>Default Meta Title</Label>
            <Input
              value={formData.meta_title || ""}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Company Name - Tagline"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.meta_title?.length || 0}/60 characters
            </p>
          </div>
          <div>
            <Label>Default Meta Description</Label>
            <Textarea
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
  );
};
