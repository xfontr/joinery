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
            // The second is an Nx `runtime` input, run by path from package.json
            entry: ["content.config.ts", "tools/lib/snapshotStamp.ts"],
            // Run by cloudflare/wrangler-action in the deploy workflow, never imported
            ignoreDependencies: ["wrangler"],
        },
        "apps/portfolio": {
            entry: ["content.config.ts"],
            // Run by cloudflare/wrangler-action in the deploy workflow, never imported
            ignoreDependencies: ["wrangler"],
        },
        "packages/configs": {
            // A spec runs @playwright/test's `playwright` binary by path
            ignoreDependencies: ["playwright"],
        },
    },
} satisfies KnipConfig;
