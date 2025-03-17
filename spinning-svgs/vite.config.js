import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [deno()],
  build: {
    rollupOptions: {
      input: {
        // Define entry points for the build
        // main: "index.html",
        index: "src/main.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Filenames you want to keep unhashed
          const noHashFiles = ["index"];
          if (noHashFiles.includes(chunkInfo.name)) {
            return "[name].js"; // Keep file unhashed
          }
          return "assets/[name]-[hash].js"; // Hash other entry files
        },

        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
