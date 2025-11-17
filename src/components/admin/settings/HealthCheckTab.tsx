import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const HealthCheckTab = () => {
  const [checks, setChecks] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const results = [];

    // Check 1: Database Connection
    try {
      const { error } = await supabase.from("site_settings").select("id").limit(1);
      results.push({
        name: "Database Connection",
        status: error ? "error" : "success",
        message: error ? error.message : "Connected successfully",
      });
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      results.push({
        name: "Security Settings",
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
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      success: "default",
      warning: "secondary",
      error: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
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
