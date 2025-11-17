import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // ViteImageOptimizer handles image optimization reliably in production
    // Removed vite-plugin-imagemin due to CI build failures
    mode === "production" && ViteImageOptimizer({
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
    sourcemap: mode === 'development', // Only in dev mode
    minify: 'esbuild', // Explicit minification using esbuild (faster than terser)
    cssMinify: true, // Explicitly enable CSS minification
    rollupOptions: {
      output: {
        // Add timestamp to filenames for cache busting
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
        manualChunks: {
          // Split vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui-core': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'vendor-ui-extended': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
          ],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-editor': ['react-quill', 'quill'],
        },
        // Additional optimizations for smaller bundles
        compact: true,
        generatedCode: {
          constBindings: true,
        },
      },
    },
    chunkSizeWarningLimit: 400, // Warn if chunks exceed 400KB (stricter budget)
    reportCompressedSize: true, // Show compressed size in build output
  },
}));
