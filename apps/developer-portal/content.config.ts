import { resolve } from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

export default defineContentConfig({
    collections: {
        docs: defineCollection({
            type: "page",
            schema: z.object({
                url: z.string().optional(),
                kind: z.string().optional(),
                verdict: z.string().optional(),
            }),
            source: {
                cwd: WORKSPACE_ROOT,
                include: "**/*.md",
                exclude: [
                    "**/node_modules/**",
                    "**/.nx/**",
                    "**/.nuxt/**",
                    "**/.output/**",
                    "**/.report/**",
                    "**/dist/**",
                    "**/coverage/**",
                    "**/CLAUDE.md",
                    "apps/portfolio/content/**",
                    "**/storybook-static/**",
                    "**/.claude/worktrees/**",
                ],
            },
        }),
    },
});
