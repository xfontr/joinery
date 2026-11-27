import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// `@nuxtjs/i18n` imports this too, and loading both at once trips a Node ESM-loader assert
await import("vue-router/unplugin");

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

const SITE_URL = "https://xifre.dev";

// Served beneath the personal site's origin, since a view transition can't cross origins
const BASE_URL = "/portal/";

const SITE_REVEAL = readFileSync(resolve(import.meta.dirname, "app/assets/siteReveal.js"), "utf8");

const PRERENDER_PERSONAL_SITE = {
    prerender: [
        {
            where: { and: [{ href_matches: "/*" }, { not: { href_matches: `${BASE_URL}*` } }] },
            eagerness: "moderate",
        },
    ],
};

export default defineNuxtConfig({
    compatibilityDate: "2025-01-15",

    modules: ["@nuxtjs/i18n", "@nuxt/ui", "@nuxt/content", "@nuxtjs/robots", "nuxt-seo-utils"],

    ssr: true,
    devtools: false,

    // `@nuxt/schema` 4.6 resolves an unset host to `{}`, which `nuxt dev` then crashes on
    devServer: { host: "localhost" },

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
        trailingSlash: false,
        separator: "-",
    },

    robots: {
        header: false,
    },

    routeRules: {
        "/**": { robots: "noindex, follow" },
    },

    nitro: {
        prerender: {
            // Cloudflare Pages serves `wiki/readme.html` at `/wiki/readme`, the route it rendered.
            autoSubfolderIndex: false,
            routes: ["/embed/data.json"],
            ignore: ["/huella-legal-storybook/"],
        },

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
        baseURL: BASE_URL,
        head: {
            link: [{ rel: "icon", type: "image/svg+xml", href: `${BASE_URL}favicon.svg` }],
            script: [
                { innerHTML: SITE_REVEAL },
                { type: "speculationrules", innerHTML: JSON.stringify(PRERENDER_PERSONAL_SITE) },
            ],
        },
    },
});
