import { LucideIcon } from "lucide-react";

interface TrustBadgeBarProps {
  certifications: Array<{
    icon: LucideIcon;
    title: string;
    subtitle: string;
  }>;
  displayTrustItems: boolean;
  trustBarItems: Array<{
    label: string;
    value: string;
  }>;
  variant?: 'sticky' | 'static';
}

export function TrustBadgeBar({
  certifications,
  displayTrustItems,
  trustBarItems,
  variant = 'static'
}: TrustBadgeBarProps) {
  const items = displayTrustItems ? trustBarItems : certifications;

  return (
    <section className="w-full bg-muted/30 border-y border-border/50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-muted">
          {displayTrustItems ? (
            trustBarItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 min-w-[180px] group">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <div className="h-5 w-5 rounded-full bg-primary/30" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground">{item.value}</div>
                </div>
              </div>
            ))
          ) : (
            certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div key={index} className="flex items-center gap-2 min-w-[180px] group">
                  <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">{cert.title}</div>
                    <div className="text-[10px] text-muted-foreground">{cert.subtitle}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
