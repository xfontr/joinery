const SITE_URL = "https://marinaroustan.com";

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    devtools: false,

    app: {
        head: {
            htmlAttrs: { lang: "es" },
            title: "Marina Roustan",
        },
    },

    typescript: {
        typeCheck: "build",
    },

    runtimeConfig: {
        public: {
            site: {
                url: SITE_URL,
            },
        },
    },
});
