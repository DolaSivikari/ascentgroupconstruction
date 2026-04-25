import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const enableImageOptimization =
    mode === "production" && process.env.ENABLE_IMAGE_OPTIMIZATION === "true";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        // Use the public preview origin (port 443) instead of localhost:8080,
        // which silences the "Failed to fetch" ping noise in deployed previews.
        // Local `bun dev` still works because Vite falls back automatically.
        clientPort: 443,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      // Keep image optimization opt-in to avoid noisy build failures when optional peer deps are not installed.
      // Enable with ENABLE_IMAGE_OPTIMIZATION=true (expects sharp + svgo available).
      enableImageOptimization &&
        ViteImageOptimizer({
          jpeg: { quality: 80 },
          jpg: { quality: 80 },
          png: { quality: 80 },
          webp: { quality: 85 },
          avif: { quality: 75 },
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === "development", // Only in dev mode
      minify: "esbuild", // Explicit minification using esbuild (faster than terser)
      cssMinify: true, // Explicitly enable CSS minification
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
          compact: true,
          generatedCode: {
            constBindings: true,
          },
        },
      },
      chunkSizeWarningLimit: 400, // Warn if chunks exceed 400KB (stricter budget)
      reportCompressedSize: true, // Show compressed size in build output
    },
  };
});
