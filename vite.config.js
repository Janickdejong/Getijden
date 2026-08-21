import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// alle bronbestanden staan in de hoofdmap van de repository
export default defineConfig({
  root: "./",
  plugins: [react()],
  build: { outDir: "dist" },
});
