import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="business-page-title">User Management</h1>
          <p className="business-page-subtitle">Manage user accounts and roles</p>
        </div>
        <InviteUserDialog onUserCreated={loadUsers} />
      </div>

      <div className="business-glass-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Role Definitions</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Control access levels and permissions for team members
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 border border-border rounded-lg">
            <Badge className="mb-2 bg-red-600">Super Admin</Badge>
            <p className="text-muted-foreground">Full access + user management</p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge className="mb-2 bg-secondary">Admin</Badge>
            <p className="text-muted-foreground">Content management + project creation</p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge className="mb-2 bg-primary">Editor</Badge>
            <p className="text-muted-foreground">Content editing + task management</p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <Badge className="mb-2 bg-blue-600">Contributor</Badge>
            <p className="text-muted-foreground">Limited content creation</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : (
        <div className="business-glass-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Team Members ({users.length})</h2>
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
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">No Role</Badge>
                    )}
                    <Badge variant="active" className="w-20 justify-center">
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
