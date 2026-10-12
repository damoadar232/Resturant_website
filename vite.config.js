import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : "/",
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(process.cwd(), "./src") } },
  server: {
    host: process.env.FIGMA_DEV_SERVER_HOST || "0.0.0.0",
    port: Number(process.env.PORT || 8443),
    strictPort: true,
  },
});
