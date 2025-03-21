import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [deno()],
  build: {
    lib: {
      entry: ["src/SpinningSVGs.ts"],
      name: "SpinningSVGs",
      fileName: "spinning-svgs",
    },
    rollupOptions: {
      input: {
        index: "src/SpinningSVGs.ts",
      },
    },
  },
});
