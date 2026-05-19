import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendTarget = "http://localhost:3002";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    allowedHosts: ["nikitamotors"],
    proxy: {
      "/api": backendTarget,
      "/uploads": backendTarget,
    },
  },
});
