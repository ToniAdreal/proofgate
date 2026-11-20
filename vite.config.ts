import { defineConfig } from "vite";

// Web app build. Output goes to dist-web/ so it never clobbers the
// core engine's tsc output in dist/ (make-sample.mjs depends on it).
// Vitest keeps using vitest.config.ts, which takes precedence.
export default defineConfig({
  build: {
    outDir: "dist-web",
    emptyOutDir: true,
  },
});
