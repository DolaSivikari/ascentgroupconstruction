// Utility to resolve asset paths from JSON/data to built URLs via Vite's import.meta.glob
// Supports paths like "/assets/filename.jpg", "src/assets/filename.jpg", or just "filename.jpg"

const rawAssets = import.meta.glob("/src/assets/**/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const assetMap: Record<string, string> = {};

Object.entries(rawAssets).forEach(([fullPath, url]) => {
  // fullPath example: "/src/assets/case-office-tower.jpg"
  assetMap[fullPath] = url;
  const afterPrefix = fullPath.split("/src/assets/")[1];
  if (afterPrefix) {
    // Map common variants that might appear in data/JSON
    assetMap[`/src/assets/${afterPrefix}`] = url;
    assetMap[`src/assets/${afterPrefix}`] = url;
    assetMap[`/assets/${afterPrefix}`] = url;
    assetMap[`assets/${afterPrefix}`] = url;
    // Also allow direct filename lookups (last resort; may collide but helpful)
    if (!assetMap[afterPrefix]) assetMap[afterPrefix] = url;
    const filenameOnly = afterPrefix.split("/").pop()!;
    if (!assetMap[filenameOnly]) assetMap[filenameOnly] = url;
  }
});

export function resolveAssetPath(input?: string): string | undefined {
  if (!input) return "/placeholder.svg";
  
  // Pass-through for absolute URLs or data URIs
  if (/^https?:\/\//.test(input) || input.startsWith("data:")) return input;

  // Try exact match
  if (assetMap[input]) return assetMap[input];

  // Normalize leading ./ or /
  const normalized = input.replace(/^\.\//, "").replace(/^\//, "");
  if (assetMap[normalized]) return assetMap[normalized];
  if (assetMap[`/${normalized}`]) return assetMap[`/${normalized}`];

  // Try mapping to /assets/<filename>
  const fileNameOnly = normalized.split("/").pop()!;
  if (assetMap[`/assets/${fileNameOnly}`]) return assetMap[`/assets/${fileNameOnly}`];
  if (assetMap[fileNameOnly]) return assetMap[fileNameOnly];

  // Log unresolved paths in development
  if (import.meta.env.DEV) {
    console.warn(`[AssetResolver] Could not resolve: "${input}"`);
  }

  // Return placeholder as fallback
  return "/placeholder.svg";
}
