export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: ["@nuxt/ui"],

    ssr: false,
    devtools: false,

    css: ["~/assets/css/main.css"],

    typescript: {
        typeCheck: false,
    },

    devServer: {
        host: "127.0.0.1",
        port: 3100,
    },

    colorMode: {
        preference: "system",
    },

    runtimeConfig: {
        wordpress: {
            baseURL: "",
            username: "",
            applicationPassword: "",
        },
        editor: {
            store: "",
        },
    },

    app: {
        head: {
            title: "WP Editor",
        },
    },
});
