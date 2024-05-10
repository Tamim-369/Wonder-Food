import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://wonderfood-api.onrender.com",
        secure: true,
        changeOrigin: true,
        headers: {
          host: "wonderfood-api.onrender.com", // Set the host header
        },
      },
    },
  },
  define: {
    // Set environment variable to bypass SSL certificate verification
    "process.env.NODE_TLS_REJECT_UNAUTHORIZED": JSON.stringify("0"),
  },
});
