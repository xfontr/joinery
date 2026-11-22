import { resolve } from "node:path";
import { imagetools } from "vite-imagetools";

// `@nuxtjs/i18n` imports this too, and loading both at once trips a Node ESM-loader assert
await import("vue-router/unplugin");

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

const SITE_URL = "https://xfontr-monorepo.pages.dev";

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: [
        "@nuxtjs/i18n",
        "@nuxt/ui",
        "@nuxt/content",
        "@nuxtjs/robots",
        "@nuxtjs/sitemap",
        "nuxt-schema-org",
        "nuxt-seo-utils",
    ],

    ssr: true,
    devtools: false,

    typescript: {
        typeCheck: false,
        tsConfig: {
            include: ["../vitest.setup.ts"],
            vueCompilerOptions: { checkUnknownComponents: true },
        },
    },

    features: { inlineStyles: true },

    experimental: {
        viewTransition: true,
        defaults: {
            nuxtLink: { prefetchOn: { visibility: false, interaction: true } },
        },
    },

    $production: {
        hooks: {
            "build:manifest": (manifest) => {
                for (const chunk of Object.values(manifest)) {
                    chunk.prefetch = false;
                    if (chunk.resourceType === "script") chunk.preload = false;
                }
            },
        },
    },

    content: {
        experimental: {
            sqliteConnector: "native",
        },
    },

    site: {
        url: SITE_URL,
        name: "Developer portal",
        trailingSlash: true,
        separator: "-",
    },

    robots: {
        header: false,
    },

    schemaOrg: {
        identity: {
            type: "Person",
            name: "Xifré Font",
            jobTitle: "Senior frontend developer",
            sameAs: ["https://www.linkedin.com/in/xifre/", "https://github.com/xfontr"],
        },
    },

    routeRules: {
        "/overview/**": { robots: "noindex, follow" },
    },

    nitro: {
        prerender: {
            ignore: ["/huella-legal-storybook/"],
        },

        watchOptions: {
            ignored: ["**/.report/**", "**/public/embed/**"],
        },
    },

    vite: {
        plugins: [imagetools()],

        server: {
            fs: {
                allow: [WORKSPACE_ROOT],
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
            link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
        },
    },
});
