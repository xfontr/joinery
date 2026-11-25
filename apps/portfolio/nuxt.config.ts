import { readdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { imagetools } from "vite-imagetools";
import { parse } from "yaml";

// `@nuxtjs/i18n` imports this too, and loading both at once trips a Node ESM-loader assert
await import("vue-router/unplugin");

const SITE_URL = "https://xifre.dev";

const SITE_REVEAL = readFileSync(resolve(import.meta.dirname, "app/assets/siteReveal.js"), "utf8");

// The developer portal is deployed beneath this origin at `/portal/`; a prerender boots a whole
// portal page, so only the view switch earns one, not every proof link a hovering pointer crosses.
const PRERENDER_PORTAL = {
    prerender: [
        {
            where: {
                and: [{ href_matches: "/portal/*" }, { selector_matches: "[data-view-switch]" }],
            },
            eagerness: "moderate",
        },
    ],
};

const WORK = resolve(import.meta.dirname, "content/work");

const isCaseStudy = (file: string): boolean => {
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(
        readFileSync(resolve(WORK, file), "utf8"),
    );

    const { caseStudy } = parse(frontmatter?.[1] ?? "") as { caseStudy?: boolean };

    return caseStudy === true;
};

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

    // `@nuxt/schema` 4.6 resolves an unset host to `{}`, which `nuxt dev` then crashes on
    devServer: { host: "localhost" },

    css: ["~/assets/main.css"],

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

    ui: {
        experimental: { componentDetection: true },
        theme: {
            colors: ["primary", "secondary", "success", "info", "warning", "error", "neutral"],
        },
    },

    fonts: {
        defaults: { subsets: ["latin"] },
        families: [
            { name: "Schibsted Grotesk", weights: [400, 500, 600] },
            { name: "Geist Mono", weights: [400, 500] },
        ],
    },

    colorMode: {
        preference: "system",
        fallback: "dark",
    },

    content: {
        experimental: {
            sqliteConnector: "native",
        },
    },

    site: {
        url: SITE_URL,
        name: "Xifré Font",
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

    nitro: {
        // A figure missing from the payload must fail the deploy, not ship a page without it
        prerender: {
            failOnError: true,
            routes: readdirSync(WORK)
                .filter((file) => file.endsWith(".md") && isCaseStudy(file))
                .map((file) => `/work/${basename(file, ".md")}`),
        },
    },

    vite: {
        plugins: [imagetools()],
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
            dataUrl: "",
        },
    },

    app: {
        head: {
            link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
            script: [
                { innerHTML: SITE_REVEAL },
                { type: "speculationrules", innerHTML: JSON.stringify(PRERENDER_PORTAL) },
            ],
        },
    },
});
