import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: true },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion": ["framer-motion"],
          "ui": ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-tooltip"],
          "supabase": ["@supabase/supabase-js"],
          "query": ["@tanstack/react-query"],
        },
      },
    },
  },
});