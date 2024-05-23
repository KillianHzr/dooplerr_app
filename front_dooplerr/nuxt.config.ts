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
  ],
  css: ["~/assets/scss/main.scss"],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
    },
  },
});
