// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
 // compatibilityDate: '2025-07-15',
 // devtools: { enabled: false }
//})


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
 modules: ["vuetify-nuxt-module","@nuxtjs/i18n", "nuxt-vuefire", '@pinia/nuxt', "@nuxt/image"],
  ssr: false,

  vuetify: {
    moduleOptions: {
      // Optional: Enable tree-shaking for smaller bundles
      treeshake: true,
      // Optional: Configure icon sets (e.g., Material Design Icons)
      icons: {
        defaultSet: 'mdi',
      },
    },
    vuetifyOptions: {
      // Optional: Customize Vuetify settings (e.g., theme)
      theme: {
        defaultTheme: 'light',
      },
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US',name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'ml', language: 'fr-FR',name: 'Français', file: 'ml.json', dir: 'ltr' }
    ],
    defaultLocale: 'en',
  },
vuefire: {
    auth: {
      enables: true,
      sessionCookie: false,
    },
    config: {
      apiKey: "AIzaSyBrhaifnmobI9zAAycgU8l2oIg_PWBNO_A",
      authDomain: "templedir.firebaseapp.com",
      projectId: "templedir",
      storageBucket: "templedir.appspot.com",
      messagingSenderId: "964021907515",
      appId: "1:964021907515:web:54e0a055c3b484a4812c1e",
    },
  },
  css: [
    "vuetify/styles",// Import Vuetify styles
    '~/assets/css/global.css', 
        'maplibre-gl/dist/maplibre-gl.css'
  ],
  vite: {
    server: {
      hmr: {
        overlay: false, // Retain your Vite HMR overlay setting
      },
    },
  },
imports: {
    // Auto-imports are enabled by default, but you can customize if needed
    autoImport: true, // Explicitly ensure auto-imports are enabled
  },
   pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'], // Auto-import Pinia helpers
  },
  compatibilityDate: "2024-11-12",
})