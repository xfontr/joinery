import { resolve } from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../..");

export default defineContentConfig({
    collections: {
        work: defineCollection({
            type: "page",
            schema: z.object({
                order: z.number(),
                name: z.string(),
                kind: z.string(),
                stage: z.string(),
                line: z.string(),
                caseStudy: z.boolean(),
                live: z.object({ href: z.string(), label: z.string() }),
                title: z.string().optional(),
                mark: z.string().optional(),
                why: z.string().optional(),
                facts: z.array(z.string()).optional(),
                countedOn: z.string().optional(),
                design: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
                screenshot: z
                    .object({ file: z.string(), alt: z.string(), caption: z.string() })
                    .optional(),
                decisions: z
                    .array(z.object({ id: z.string(), question: z.string(), answer: z.string() }))
                    .optional(),
            }),
            source: { cwd: resolve(import.meta.dirname, "content"), include: "work/*.md" },
        }),

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
                    "apps/developer-portal/content/**",
                    "**/storybook-static/**",
                    "**/.claude/worktrees/**",
                ],
            },
        }),
    },
});
