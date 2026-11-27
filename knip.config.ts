import type { KnipConfig } from "knip";

export default {
    // `pnpm cli` is infrastructure/scripts' own script, not a binary
    ignoreBinaries: ["cli"],
    ignoreDependencies: [
        // Nuxt Icon reads the set through `i-lucide-*` names, never an import
        "@iconify-json/lucide",
        // Run by Nx's inferred `eslint:lint` and Nuxt's `typeCheck`, never imported
        "eslint",
        "vue-tsc",
    ],
    workspaces: {
        ".": {
            entry: [".claude/workflows/*.js"],
        },
        "apps/huella-legal": {
            // Preloaded through NODE_OPTIONS, and handed to Storybook's auto-import by path
            entry: ["mocks/server.ts", ".storybook/appConfig.ts"],
        },
        "apps/developer-portal": {
            // The second is an Nx `runtime` input, run by path from package.json; the third is read
            // as text and inlined into <head> by nuxt.config.ts
            entry: ["content.config.ts", "tools/lib/snapshotStamp.ts", "app/assets/siteReveal.js"],
            // Run by cloudflare/wrangler-action in the deploy workflow, never imported
            ignoreDependencies: ["wrangler"],
        },
        "apps/portfolio": {
            // The second is read as text and inlined into <head> by nuxt.config.ts
            entry: ["content.config.ts", "app/assets/siteReveal.js"],
            // Run by cloudflare/wrangler-action in the deploy workflow, never imported
            ignoreDependencies: ["wrangler"],
        },
        "packages/i18n": {
            // Handed to @nuxtjs/i18n by its folder and file name, never imported
            entry: ["src/nuxt/runtime/locales/loader.ts"],
        },
        "packages/configs": {
            // A spec runs @playwright/test's `playwright` binary by path
            ignoreDependencies: ["playwright"],
        },
    },
} satisfies KnipConfig;
