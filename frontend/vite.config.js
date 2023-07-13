import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001/",
      },
      "/uploads": {
        target: "http://127.0.0.1:5001/",
      },
    },
  },
});
