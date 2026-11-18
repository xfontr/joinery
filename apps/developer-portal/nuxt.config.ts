import { resolve } from "node:path";

// `@nuxtjs/i18n` imports this too, and loading both at once trips a Node ESM-loader assert
await import("vue-router/unplugin");

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: ["@nuxtjs/i18n", "@nuxt/ui", "@nuxt/content"],

    ssr: true,
    devtools: false,

    typescript: {
        typeCheck: false,
        // A component left behind by a removed layer then fails typecheck instead of rendering nothing.
        tsConfig: { vueCompilerOptions: { checkUnknownComponents: true } },
    },

    content: {
        experimental: {
            sqliteConnector: "native",
        },
    },

    nitro: {
        prerender: {
            ignore: [`${process.env.NUXT_APP_BASE_URL ?? "/"}huella-legal-storybook/`],
        },

        // The collectors reach outside `apps/developer-portal` on purpose, and the two vendored report
        // trees under `public/` are thousands of files the dev server has no reason to watch.
        watchOptions: {
            ignored: ["**/.report/**", "**/public/embed/**"],
        },
    },

    vite: {
        server: {
            fs: {
                allow: [WORKSPACE_ROOT],
            },
        },
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

    i18n: {
        locales: [{ code: "en", language: "en", file: "en.json" }],
        defaultLocale: "en",
        strategy: "no_prefix",
        detectBrowserLanguage: false,
    },

    runtimeConfig: {
        public: {
            repoUrl: "",
        },
    },

    app: {
        head: {
            title: "Monorepo",
            link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
        },
    },
});
