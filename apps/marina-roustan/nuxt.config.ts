const SITE_URL = "https://marinaroustan.com";

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: ["@nuxt/ui", "@nuxt/fonts"],

    devtools: false,

    // `@nuxt/schema` 4.6 resolves an unset host to `{}`, which `nuxt dev` then crashes on
    devServer: { host: "localhost" },

    app: {
        head: {
            htmlAttrs: { lang: "es" },
            title: "Marina Roustan",
        },
    },

    typescript: {
        typeCheck: "build",
    },

    $production: {
        hooks: {
            "pages:extend": (pages) => {
                for (let index = pages.length - 1; index >= 0; index--) {
                    if (pages[index]?.path.startsWith("/lab")) pages.splice(index, 1);
                }
            },
        },
    },

    runtimeConfig: {
        public: {
            site: {
                url: SITE_URL,
            },
        },
    },
});
