import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContentVersioning() {
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const { data: versions, isLoading } = useQuery({
    queryKey: ["content-versions", entityTypeFilter],
    queryFn: async () => {
      let query = supabase
        .from("content_versions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (entityTypeFilter !== "all") {
        query = query.eq("entity_type", entityTypeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const getEntityTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      blog_posts: "bg-blue-500",
      projects: "bg-purple-500",
      services: "bg-green-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <AdminPageLayout
      title="📝 Content Versioning"
      description="Track changes, view revision history, and restore previous versions"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <History className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Versions</p>
                <p className="text-2xl font-bold">{versions?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Changes</p>
                <p className="text-2xl font-bold">
                  {versions?.filter(v => 
                    new Date(v.created_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Content Types</p>
                <p className="text-2xl font-bold">
                  {new Set(versions?.map(v => v.entity_type)).size}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog_posts">Blog Posts</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Versions Table */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Revision History</h3>
            <p className="text-sm text-muted-foreground">Browse and compare content versions</p>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : versions && versions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Change Summary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="text-sm">
                        {format(new Date(version.created_at), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEntityTypeBadge(version.entity_type)}>
                          {version.entity_type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">v{version.version_number}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                        {version.entity_id}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {version.change_summary || "No summary provided"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVersion(version)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No version history found
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Version Details Dialog */}
      <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version Details</DialogTitle>
            <DialogDescription>
              Content snapshot from {selectedVersion && format(new Date(selectedVersion.created_at), "PPpp")}
            </DialogDescription>
          </DialogHeader>
          {selectedVersion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2 font-mono">v{selectedVersion.version_number}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className={`ml-2 ${getEntityTypeBadge(selectedVersion.entity_type)}`}>
                    {selectedVersion.entity_type}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Change Summary:</span>
                  <p className="mt-1">{selectedVersion.change_summary || "No summary"}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Content Snapshot</h4>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(selectedVersion.content_snapshot, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}
