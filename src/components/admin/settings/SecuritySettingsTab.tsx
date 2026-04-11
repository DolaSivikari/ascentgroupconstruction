import { useState, useEffect } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { toast } from "sonner";
import { Save, Shield } from "lucide-react";

const DEFAULTS = {
  mfa_required: false,
  session_timeout_minutes: 120,
  max_failed_login_attempts: 5,
  audit_retention_days: 90,
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_lowercase: true,
  password_require_numbers: true,
  password_require_special: false,
};

export const SecuritySettingsTab = () => {
  const { data: settings, loading, refetch } = useSettingsData("security_settings");
  const [formData, setFormData] = useState<any>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        mfa_required: settings.mfa_required ?? DEFAULTS.mfa_required,
        session_timeout_minutes: settings.session_timeout_minutes ?? DEFAULTS.session_timeout_minutes,
        max_failed_login_attempts: settings.max_failed_login_attempts ?? DEFAULTS.max_failed_login_attempts,
        audit_retention_days: settings.audit_retention_days ?? DEFAULTS.audit_retention_days,
        password_min_length: settings.password_min_length ?? DEFAULTS.password_min_length,
        password_require_uppercase: settings.password_require_uppercase ?? DEFAULTS.password_require_uppercase,
        password_require_lowercase: settings.password_require_lowercase ?? DEFAULTS.password_require_lowercase,
        password_require_numbers: settings.password_require_numbers ?? DEFAULTS.password_require_numbers,
        password_require_special: settings.password_require_special ?? DEFAULTS.password_require_special,
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
          .from("security_settings")
          .update(formData)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        // No row — insert one with is_active: true
        const { error } = await supabase
          .from("security_settings")
          .insert({ ...formData, is_active: true });
        if (error) throw error;
      }
      toast.success("Security settings saved");
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
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              {settings
                ? "Configure authentication, session, and password policies."
                : "No settings row found — fill in the form below and save to create one."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Authentication */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Authentication</h3>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <Label className="text-sm font-medium">Require Multi-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Force all admin users to enable MFA</p>
            </div>
            <Switch
              checked={formData.mfa_required}
              onCheckedChange={v => set("mfa_required", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Session Timeout (minutes)</Label>
              <Input
                type="number"
                min={15}
                value={formData.session_timeout_minutes}
                onChange={e => set("session_timeout_minutes", parseInt(e.target.value) || 120)}
              />
              <p className="text-xs text-muted-foreground mt-1">Idle sessions expire after this duration</p>
            </div>
            <div>
              <Label>Max Failed Login Attempts</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={formData.max_failed_login_attempts}
                onChange={e => set("max_failed_login_attempts", parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-muted-foreground mt-1">Account locks after this many failures</p>
            </div>
          </div>
        </section>

        {/* Audit */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Audit Logging</h3>
          <div>
            <Label>Log Retention (days)</Label>
            <Input
              type="number"
              min={7}
              value={formData.audit_retention_days}
              onChange={e => set("audit_retention_days", parseInt(e.target.value) || 90)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">Audit log entries older than this are automatically deleted</p>
          </div>
        </section>

        {/* Password Policy */}
        <section className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Password Policy</h3>
          <div className="mb-4">
            <Label>Minimum Length</Label>
            <Input
              type="number"
              min={6}
              max={32}
              value={formData.password_min_length}
              onChange={e => set("password_min_length", parseInt(e.target.value) || 8)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-3">
            {[
              { key: "password_require_uppercase", label: "Require uppercase letters (A–Z)" },
              { key: "password_require_lowercase", label: "Require lowercase letters (a–z)" },
              { key: "password_require_numbers", label: "Require numbers (0–9)" },
              { key: "password_require_special", label: "Require special characters (!@#$…)" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <Label className="text-sm font-normal">{label}</Label>
                <Switch
                  checked={formData[key]}
                  onCheckedChange={v => set(key, v)}
                />
              </div>
            ))}
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
