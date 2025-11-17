import * as LucideIcons from "lucide-react";

interface CredentialBadgeProps {
  icon: string;
  stat: string;
  label: string;
}

const CredentialBadge = ({ icon, stat, label }: CredentialBadgeProps) => {
  const Icon = (LucideIcons as any)[icon] || LucideIcons.BadgeCheck;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-steel-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-steel-blue/20 transition-colors">
        <Icon className="w-5 h-5 text-steel-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold text-foreground mb-0.5 leading-tight">
          {stat}
        </div>
        <div className="text-sm text-muted-foreground leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
};

export default CredentialBadge;
