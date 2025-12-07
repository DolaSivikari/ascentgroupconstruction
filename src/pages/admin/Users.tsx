import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import { PermissionMatrix } from "@/components/admin/PermissionMatrix";
import { RoleDistributionCard } from "@/components/admin/RoleDistributionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setIsLoading(true);
    
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name");

    if (profilesError) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast({
        title: "Error",
        description: "Failed to load user roles",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const usersWithRoles = profiles.map(profile => ({
      ...profile,
      roles: roles.filter(r => r.user_id === profile.id).map(r => r.role),
    }));

    setUsers(usersWithRoles);
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
      return;
    }

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role: newRole as any }]);

    if (insertError) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      loadUsers();
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="business-page-title">User Management</h1>
          <p className="business-page-subtitle">Manage user accounts and roles</p>
        </div>
        <InviteUserDialog onUserCreated={loadUsers} />
      </div>

      <div className="business-glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="business-section-title">Role Definitions</h2>
        </div>
        <p className="business-section-subtitle mb-4">
          Control access levels and permissions for team members
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm mb-6">
          <div className="p-3 border border-border rounded-lg">
            <Badge variant="danger" className="mb-2">Super Admin</Badge>
            <p className="text-muted-foreground mb-2">Full system access</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ User management</li>
              <li>✓ All content operations</li>
              <li>✓ System settings</li>
              <li>✓ Analytics access</li>
            </ul>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge variant="warning" className="mb-2">Admin</Badge>
            <p className="text-muted-foreground mb-2">Content & inbox management</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ All content operations</li>
              <li>✓ Inbox management</li>
              <li>✓ Analytics access</li>
              <li>✗ User management</li>
            </ul>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge variant="primary" className="mb-2">Editor</Badge>
            <p className="text-muted-foreground mb-2">Content editing</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Edit existing content</li>
              <li>✓ Manage drafts</li>
              <li>✗ Publish content</li>
              <li>✗ Settings access</li>
            </ul>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge variant="info" className="mb-2">Contributor</Badge>
            <p className="text-muted-foreground mb-2">Limited creation</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Create drafts</li>
              <li>✓ Submit for review</li>
              <li>✗ Publish content</li>
              <li>✗ Edit others' work</li>
            </ul>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge variant="secondary" className="mb-2">Viewer</Badge>
            <p className="text-muted-foreground mb-2">Read-only access</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ View content</li>
              <li>✓ View analytics</li>
              <li>✗ Edit anything</li>
              <li>✗ Create content</li>
            </ul>
          </div>
        </div>
        
        <PermissionMatrix />
      </div>

      <RoleDistributionCard users={users} />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : (
        <div className="business-glass-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              <h2 className="business-section-title">Team Members ({users.length})</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name || "No name"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.roles.length > 0 ? (
                      <Select
                        value={user.roles[0]}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="contributor">Contributor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary">No Role</Badge>
                    )}
                    <Badge variant="success" className="w-20 justify-center">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
