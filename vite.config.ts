import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },

      manifest: {
        id: "/",
        name: "CashVault",
        short_name: "CashVault",

        description:
          "A secure and organized personal finance manager.",

        start_url: "/",
        scope: "/",

        theme_color: "#0b0b0b",
        background_color: "#0b0b0b",

        display: "standalone",
        orientation: "portrait",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],

        screenshots: [
          {
            src: "screenshot-desktop.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "CashVault desktop dashboard",
          },
          {
            src: "screenshot-mobile.png",
            sizes: "1080x1920",
            type: "image/png",
            label: "CashVault mobile dashboard",
          },
        ],
      },
    }),
  ],
});