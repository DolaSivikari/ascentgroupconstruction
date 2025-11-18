import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-20 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}
