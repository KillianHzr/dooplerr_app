// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Jost: true,
          download: true,
          inject: true,
        },
      },
    ],
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
    "nuxt-icon",
    "@vueuse/nuxt",
  ],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      titleTemplate: "%s - Dooplerr la plateforme de podcasts interactive",
      meta: [
        { name: "description", content: "Dooplerr est une web app de podcasts où vous pouvez écouter des podcasts, ajouter les vôtres et interagir avec la communauté." },
        // Add other default meta tags here
      ],
    },
  },
  pwa: {
    manifest: {
      name: "Dooplerr",
      short_name: "Dooplerr",
      description: "Dooplerr",
      theme_color: "#060511",
      lang: "fr",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "android-launchericon-512-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
  },
  css: ["~/assets/scss/main.scss"],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
    },
  },
});
