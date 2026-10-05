import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ExplorerTabs({
  label,
  options,
  value,
  onChange,
  children,
}: {
  label: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Tabs value={value} onValueChange={onChange} className="min-w-0">
      <div className="max-w-full overflow-x-auto pb-2">
        <TabsList
          aria-label={label}
          className="h-auto min-w-max gap-1 bg-transparent p-0"
        >
          {options.map((option) => (
            <TabsTrigger
              key={option.id}
              value={option.id}
              className="rounded-lg border border-border bg-background px-4 py-3 text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground motion-reduce:transition-none"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={value} className="mt-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}
