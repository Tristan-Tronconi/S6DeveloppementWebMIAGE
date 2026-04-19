import { defineConfig } from "vite";

export default defineConfig({
  base: "/whatWasLeftOpen/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ["@babylonjs/core", "@babylonjs/inspector"],
          howler: ["howler"]
        }
      }
    }
  },
  publicDir: "assets"
});
