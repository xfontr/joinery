// `@nuxtjs/i18n` imports this too, and loading both at once trips a Node ESM-loader assert
await import("vue-router/unplugin");

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: ["@nuxtjs/i18n", "@nuxt/ui", "@nuxt/fonts"],

    devtools: false,

    // `@nuxt/schema` 4.6 resolves an unset host to `{}`, which `nuxt dev` then crashes on
    devServer: { host: "localhost" },

    app: {
        head: {
            htmlAttrs: { lang: "en" },
            title: "Alba Tomico",
        },
    },

    typescript: {
        typeCheck: "build",
    },

    i18n: {
        locales: [{ code: "en", language: "en-US", file: "en.json" }],
        defaultLocale: "en",
        strategy: "no_prefix",
        detectBrowserLanguage: false,
    },

    routeRules: {
        "/": { prerender: true },
    },
});
