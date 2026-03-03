import { Card } from "@/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface Permission {
  name: string;
  super_admin: boolean;
  admin: boolean;
  editor: boolean;
  contributor: boolean;
  viewer: boolean;
}

const permissions: Permission[] = [
  { name: "User Management", super_admin: true, admin: false, editor: false, contributor: false, viewer: false },
  { name: "Create Content", super_admin: true, admin: true, editor: true, contributor: true, viewer: false },
  { name: "Edit Content", super_admin: true, admin: true, editor: true, contributor: false, viewer: false },
  { name: "Publish Content", super_admin: true, admin: true, editor: false, contributor: false, viewer: false },
  { name: "Delete Content", super_admin: true, admin: true, editor: false, contributor: false, viewer: false },
  { name: "View Inbox", super_admin: true, admin: true, editor: false, contributor: false, viewer: false },
  { name: "Manage Settings", super_admin: true, admin: true, editor: false, contributor: false, viewer: false },
  { name: "View Analytics", super_admin: true, admin: true, editor: false, contributor: false, viewer: true },
  { name: "Manage Media", super_admin: true, admin: true, editor: true, contributor: true, viewer: false },
  { name: "SEO Management", super_admin: true, admin: true, editor: true, contributor: false, viewer: false },
];

export const PermissionMatrix = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Permission Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                Permission
              </th>
              <th className="text-center py-3 px-2">
                <Badge variant="danger">Super Admin</Badge>
              </th>
              <th className="text-center py-3 px-2">
                <Badge variant="warning">Admin</Badge>
              </th>
              <th className="text-center py-3 px-2">
                <Badge variant="primary">Editor</Badge>
              </th>
              <th className="text-center py-3 px-2">
                <Badge variant="info">Contributor</Badge>
              </th>
              <th className="text-center py-3 px-2">
                <Badge variant="secondary">Viewer</Badge>
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">{permission.name}</td>
                <td className="text-center py-3 px-2">
                  {permission.super_admin ? (
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {permission.admin ? (
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {permission.editor ? (
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {permission.contributor ? (
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="text-center py-3 px-2">
                  {permission.viewer ? (
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        This matrix defines the access control for each role. Changes to permissions require code updates.
      </p>
    </Card>
  );
};
