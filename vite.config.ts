import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // define: { process: process.env },
  plugins: [react()],
  server: {
    port: 8000,
    strictPort: true,
  },
});
