import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "ShoppList",
        short_name: "ShoppList",
        theme_color: "#bd93f9",
        background_color: "#f8f8f2",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "src/imgs/favicon.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "src/imgs/pwa/favicon192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "src/imgs/pwa/favicon512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
