import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Search, AlertTriangle, Activity, User } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["audit-logs", actionFilter],
    queryFn: async () => {
      let query = supabase
        .from("audit_log")
        .select(`
          id,
          object_type,
          object_id,
          action,
          user_id,
          created_at,
          ip_address,
          user_agent,
          before_state,
          after_state
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: failedAttempts } = useQuery({
    queryKey: ["failed-attempts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auth_failed_attempts")
        .select("*")
        .order("attempt_time", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const filteredLogs = auditLogs?.filter(log => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      log.object_type.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.ip_address?.toLowerCase().includes(searchLower)
    );
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT": return "bg-green-500";
      case "UPDATE": return "bg-blue-500";
      case "DELETE": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AdminPageLayout
      title="🛡️ Audit Dashboard"
      description="Security events, access logs, and system activity monitoring"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{auditLogs?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold">{failedAttempts?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">
                  {new Set(auditLogs?.map(l => l.user_id)).size}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Activity</p>
                <p className="text-2xl font-bold">
                  {auditLogs?.filter(l => 
                    new Date(l.created_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by object type, action, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="INSERT">Insert</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Activity Log</h3>
            <p className="text-sm text-muted-foreground">Recent system events and user actions</p>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Object Type</TableHead>
                    <TableHead>Object ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.object_type}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                        {log.object_id}
                      </TableCell>
                      <TableCell className="text-sm">{log.ip_address || "N/A"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {log.user_agent || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No audit logs found
              </div>
            )}
          </div>
        </Card>

        {/* Failed Login Attempts */}
        {failedAttempts && failedAttempts.length > 0 && (
          <Card>
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Failed Login Attempts</h3>
              </div>
              <p className="text-sm text-muted-foreground">Recent authentication failures</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User Identifier</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedAttempts.slice(0, 20).map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="text-sm">
                        {format(new Date(attempt.attempt_time), "MMM dd, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{attempt.user_identifier}</TableCell>
                      <TableCell className="text-sm">{attempt.ip_address || "N/A"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {attempt.user_agent || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  );
}
