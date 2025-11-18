import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface RoleDistributionCardProps {
  users: Array<{ roles: string[] }>;
}

export const RoleDistributionCard = ({ users }: RoleDistributionCardProps) => {
  const roleCount = users.reduce((acc, user) => {
    user.roles.forEach(role => {
      acc[role] = (acc[role] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const roleColors: Record<string, string> = {
    super_admin: "bg-red-600",
    admin: "bg-orange-600",
    editor: "bg-primary",
    contributor: "bg-blue-600",
    viewer: "bg-slate-600",
  };

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    editor: "Editor",
    contributor: "Contributor",
    viewer: "Viewer",
  };

  const totalRoles = Object.values(roleCount).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Role Distribution</h3>
      </div>
      
      {totalRoles === 0 ? (
        <p className="text-sm text-muted-foreground">No roles assigned yet</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(roleCount).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={roleColors[role] || "bg-secondary"}>
                  {roleLabels[role] || role}
                </Badge>
                <span className="text-sm text-muted-foreground">{count} user{count !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${roleColors[role]}`}
                    style={{ width: `${(count / totalRoles) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium">
                {Math.round((count / totalRoles) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
