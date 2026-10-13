import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

/** This index is itself deferred, so navigation never loads the whole icon library. */
export async function loadIcon(
  name: string,
): Promise<ComponentType<LucideProps> | null> {
  const key = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  const canonical = Object.keys(dynamicIconImports).find(
    (candidate) =>
      candidate.replace(/-/g, "") === name.toLowerCase().replace(/-/g, ""),
  );
  const loader =
    dynamicIconImports[
      (key in dynamicIconImports
        ? key
        : canonical) as keyof typeof dynamicIconImports
    ];
  if (!loader) return null;
  try {
    return (await loader()).default;
  } catch {
    return null;
  }
}
