import { resolve } from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

export default defineContentConfig({
    collections: {
        docs: defineCollection({
            type: "page",
            // Only docs/benchmarks/ sets these; the wiki nav sorts and tags its entries by them.
            schema: z.object({
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
                    // Agent instructions, read on GitHub; `remarkDocLinks` sends links to them there.
                    "**/CLAUDE.md",
                    "**/storybook-static/**",
                    // Each is a full checkout of the repo at a point in time — every doc in it duplicates one already collected.
                    "**/.claude/worktrees/**",
                ],
            },
        }),
    },
});
