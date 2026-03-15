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
        protocol: "ws",
        host: "localhost",
        port: 8080,
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
          /**
           * Manual chunk splitting — prevents heavy vendor libs from landing
           * in the main bundle that every visitor downloads on first load.
           */
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;

            // All Radix UI primitives → single UI vendor chunk
            if (id.includes('@radix-ui')) return 'ui-vendor';

            // Recharts + D3 (admin-only) → separate lazy chunk
            if (id.includes('recharts') || id.includes('/d3-') || id.includes('d3/')) return 'charts';

            // Framer Motion → separate chunk (only pulled when animated components render)
            if (id.includes('framer-motion')) return 'motion';

            // Supabase (data layer) → separate chunk
            if (id.includes('@supabase')) return 'supabase';

            // TanStack Query → separate chunk
            if (id.includes('@tanstack')) return 'query';

            // React core → stable vendor chunk (aggressive browser caching)
            if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          },
        },
      },
      chunkSizeWarningLimit: 400, // Warn if chunks exceed 400KB (stricter budget)
      reportCompressedSize: true, // Show compressed size in build output
    },
  };
});
