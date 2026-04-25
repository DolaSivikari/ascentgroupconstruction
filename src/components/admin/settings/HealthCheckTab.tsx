import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HealthCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export const HealthCheckTab = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const results: HealthCheck[] = [];

    // Check 1: Database Connection
    try {
      const { error } = await supabase.from("site_settings").select("id").limit(1);
      results.push({
        name: "Database Connection",
        status: error ? "error" : "success",
        message: error ? error.message : "Connected successfully",
      });
    } catch {
      results.push({
        name: "Database Connection",
        status: "error",
        message: "Failed to connect",
      });
    }

    // Check 2: Site Settings
    try {
      const { data, error } = await supabase.from("site_settings").select("*").eq("is_active", true);
      results.push({
        name: "Site Settings",
        status: error || !data || data.length === 0 ? "warning" : "success",
        message: error ? error.message : data?.length === 0 ? "No active settings found" : "Configured",
      });
    } catch {
      results.push({
        name: "Site Settings",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 3: Footer Settings
    try {
      const { data, error } = await supabase.from("footer_settings").select("*").eq("is_active", true);
      results.push({
        name: "Footer Settings",
        status: error || !data || data.length === 0 ? "warning" : "success",
        message: error ? error.message : data?.length === 0 ? "No active settings found" : "Configured",
      });
    } catch {
      results.push({
        name: "Footer Settings",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 4: Contact Page Settings
    try {
      const { data, error } = await supabase.from("contact_page_settings").select("*").eq("is_active", true);
      results.push({
        name: "Contact Page Settings",
        status: error || !data || data.length === 0 ? "warning" : "success",
        message: error ? error.message : data?.length === 0 ? "No active settings found" : "Configured",
      });
    } catch {
      results.push({
        name: "Contact Page Settings",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 5: About Page Settings
    try {
      const { data, error } = await supabase.from("about_page_settings").select("*").eq("is_active", true);
      results.push({
        name: "About Page Settings",
        status: error || !data || data.length === 0 ? "warning" : "success",
        message: error ? error.message : data?.length === 0 ? "No active settings found" : "Configured",
      });
    } catch {
      results.push({
        name: "About Page Settings",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 6: Security Settings
    try {
      const { data, error } = await supabase.from("security_settings").select("*").eq("is_active", true);
      results.push({
        name: "Security Settings",
        status: error || !data || data.length === 0 ? "warning" : "success",
        message: error ? error.message : data?.length === 0 ? "No active settings found" : "Configured",
      });
    } catch {
      results.push({
        name: "Security Settings",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 7: Documents Library
    try {
      const { count, error } = await supabase.from("documents_library").select("*", { count: 'exact', head: true }).eq("is_active", true);
      results.push({
        name: "Documents Library",
        status: error ? "error" : count && count > 0 ? "success" : "warning",
        message: error ? error.message : `${count || 0} active documents`,
      });
    } catch {
      results.push({
        name: "Documents Library",
        status: "error",
        message: "Failed to check",
      });
    }

    // Check 8: Storage Bucket
    try {
      const { error } = await supabase.storage.from('project-images').list('', { limit: 1 });
      results.push({
        name: "Storage Bucket",
        status: error ? "error" : "success",
        message: error ? error.message : "Accessible",
      });
    } catch {
      results.push({
        name: "Storage Bucket",
        status: "warning",
        message: "Could not verify",
      });
    }

    // Check 9: Admin Users
    try {
      const { count, error } = await supabase.from("user_roles").select("*", { count: 'exact', head: true }).in('role', ['admin', 'super_admin']);
      results.push({
        name: "Admin Users",
        status: error ? "error" : count && count >= 1 ? "success" : "warning",
        message: error ? error.message : `${count || 0} admin users configured`,
      });
    } catch {
      results.push({
        name: "Admin Users",
        status: "error",
        message: "Failed to check",
      });
    }

    setChecks(results);
    setIsChecking(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <XCircle className="h-5 w-5 text-danger" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      warning: "secondary",
      error: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const stats = {
    success: checks.filter(c => c.status === 'success').length,
    warning: checks.filter(c => c.status === 'warning').length,
    error: checks.filter(c => c.status === 'error').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Health Check</CardTitle>
            <CardDescription>
              Diagnose and monitor configuration issues across all settings
            </CardDescription>
          </div>
          <Button onClick={runHealthChecks} disabled={isChecking} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        {checks.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="text-2xl font-bold text-success">{stats.success}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="text-2xl font-bold text-warning">{stats.warning}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center p-3 bg-danger/10 rounded-lg border border-danger/20">
              <div className="text-2xl font-bold text-danger">{stats.error}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <h4 className="font-medium">{check.name}</h4>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>

        {checks.length === 0 && !isChecking && (
          <div className="text-center py-12 text-muted-foreground">
            Click "Refresh" to run health checks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
