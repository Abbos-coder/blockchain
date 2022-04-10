import colors from "vuetify/es5/util/colors";

export default {
   target: "static",
   // Global page headers: https://go.nuxtjs.dev/config-head
   head: {
      title: "MyteamArt",
      htmlAttrs: {
         lang: "en",
      },
      meta: [
         { charset: "utf-8" },
         { name: "viewport", content: "width=device-width, initial-scale=1" },
         { hid: "description", name: "description", content: "" },
         { name: "format-detection", content: "telephone=no" },
      ],
      link: [
         { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
         {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Icons",
         },

         {
            rel: "stylesheet",
            href: "https://use.fontawesome.com/releases/v5.15.4/css/all.css",
         },
      ],
      script: [
         {
            src: "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.2/js/swiper.min.js",
         },
      ],
   },

   // Global CSS: https://go.nuxtjs.dev/config-css
   css: [],

   // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
   plugins: ["~/plugins/swiper.client.js", "~/plugins/globals.js"],

   // Auto import components: https://go.nuxtjs.dev/config-components
   components: true,

   loading: {
      color: "gold",
   },
   loadingIndicator: {
      name: "circle",
      color: "#3B8070",
      background: "white",
   },
   // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
   buildModules: [
      "@nuxtjs/style-resources",
      // https://go.nuxtjs.dev/vuetify
      "@nuxtjs/vuetify",
   ],
   styleResources: {
      scss: ["./assets/vars/*.scss", "./assets/abstracts/_mixin.scss"],
   },
   // Modules: https://go.nuxtjs.dev/config-modules
   modules: [
      // https://go.nuxtjs.dev/axios
      "@nuxtjs/axios",
      "@nuxtjs/auth-next",
      "@nuxtjs/toast",
      "@nuxtjs/i18n",
   ],
   auth: {
      strategies: {
         local: {
            token: {
               property: "token",
               global: true,
               type: "Token",
            },
         },
      },
   },

   toast: {
      position: "top-right",
      duration: 5000,
   },

   // Axios module configuration: https://go.nuxtjs.dev/config-axios
   axios: {
      baseURL: "https://api.myteamart.org",
   },

   // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
   vuetify: {
      customVariables: ["~/assets/variables.scss"],
      theme: {
         dark: false,
         themes: {
            dark: {
               primary: colors.blue.darken2,
               accent: colors.grey.darken3,
               secondary: colors.amber.darken3,
               info: colors.teal.lighten1,
               warning: colors.amber.base,
               error: colors.deepOrange.accent4,
               success: colors.green.accent3,
            },
         },
      },
   },
   // Build Configuration: https://go.nuxtjs.dev/config-build
   build: {},
   server: {
      host: "0",
      port: 8000,
   },
};
