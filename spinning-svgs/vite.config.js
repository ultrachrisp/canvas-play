import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [deno()],
  build: {
    rollupOptions: {
      input: {
        index: "src/main.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const noHashFiles = ["index"];
          if (noHashFiles.includes(chunkInfo.name)) {
            return "[name].js";
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
