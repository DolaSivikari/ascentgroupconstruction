import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Shield } from "lucide-react";

export const SecuritySettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("security_settings");
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        mfa_required: settings.mfa_required || false,
        session_timeout_minutes: settings.session_timeout_minutes || 120,
        max_failed_login_attempts: settings.max_failed_login_attempts || 5,
        audit_retention_days: settings.audit_retention_days || 90,
        password_min_length: settings.password_min_length || 8,
        password_require_uppercase: settings.password_require_uppercase || true,
        password_require_lowercase: settings.password_require_lowercase || true,
        password_require_numbers: settings.password_require_numbers || true,
        password_require_special: settings.password_require_special || true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("security_settings")
        .update(formData)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast.success("Security settings saved successfully");
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
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure authentication, MFA, and security policies
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Force all admin users to enable MFA</p>
            </div>
            <Switch
              checked={formData.mfa_required || false}
              onCheckedChange={(checked) => setFormData({ ...formData, mfa_required: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Session Timeout (minutes)</Label>
              <Input
                type="number"
                value={formData.session_timeout_minutes || ""}
                onChange={(e) => setFormData({ ...formData, session_timeout_minutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max Failed Login Attempts</Label>
              <Input
                type="number"
                value={formData.max_failed_login_attempts || ""}
                onChange={(e) => setFormData({ ...formData, max_failed_login_attempts: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Audit Log Retention (days)</Label>
            <Input
              type="number"
              value={formData.audit_retention_days || ""}
              onChange={(e) => setFormData({ ...formData, audit_retention_days: parseInt(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground mt-1">How long to keep audit logs</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Password Requirements</h3>
            <div className="space-y-4">
              <div>
                <Label>Minimum Length</Label>
                <Input
                  type="number"
                  value={formData.password_min_length || ""}
                  onChange={(e) => setFormData({ ...formData, password_min_length: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Require Uppercase Letters</Label>
                  <Switch
                    checked={formData.password_require_uppercase || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, password_require_uppercase: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Lowercase Letters</Label>
                  <Switch
                    checked={formData.password_require_lowercase || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, password_require_lowercase: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Switch
                    checked={formData.password_require_numbers || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, password_require_numbers: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch
                    checked={formData.password_require_special || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, password_require_special: checked })}
                  />
                </div>
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
