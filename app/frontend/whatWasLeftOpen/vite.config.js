import { defineConfig } from "vite";

export default defineConfig({
  base: "/whatWasLeftOpen/",
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  publicDir: "assets"
});
