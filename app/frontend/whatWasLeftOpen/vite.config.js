import { defineConfig } from "vite";

export default defineConfig({
  base: "/whatWasLeftOpen/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("babylon")) return "babylon";
          if (id.includes("howler")) return "howler";
        }
      }
    }
  },
  publicDir: "assets"
});
