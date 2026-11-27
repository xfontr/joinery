import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const content = vi.hoisted(() => {
    const pages = vi.fn();
    const query = { where: () => query, select: () => query, all: pages };
    return { pages, queryCollection: () => query };
});

vi.mock("@nuxt/content/server", () => content);
vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

import handler from "./data.json.ts";

let dir = "";

const artifact = (name: string, value: unknown) =>
    writeFile(join(dir, `${name}.json`), JSON.stringify(value));

beforeEach(async () => {
    vi.clearAllMocks();
    content.pages.mockResolvedValue([]);
    dir = await mkdtemp(join(tmpdir(), "embed-"));
    vi.stubGlobal("useRuntimeConfig", () => ({ snapshotDir: dir, workflowsDir: dir }));
});

afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(dir, { recursive: true, force: true });
});

describe("site data payload", () => {
    // apps/portfolio reads these keys at build; renaming one blanks its figures without failing
    it("keeps every key the personal site reads", async () => {
        const data = await handler({} as never);

        expect(Object.keys(data).sort()).toEqual(
            ["benchmarks", "decisions", "rules", "specs", "workflows"].sort(),
        );
        expect(Object.keys(data.workflows).sort()).toEqual(["lessons", "projects", "templates"]);
    });

    it("answers with empty figures when nothing was collected, so the site still builds", async () => {
        await expect(handler({} as never)).resolves.toEqual({
            benchmarks: [],
            decisions: [],
            workflows: { projects: [], templates: [], lessons: 0 },
            rules: null,
            specs: null,
        });
    });

    it("lists a benchmark with the screenshot path this site serves", async () => {
        content.pages.mockResolvedValue([
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me", verdict: "strong" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ]);

        const { benchmarks } = await handler({} as never);

        expect(benchmarks).toEqual([
            {
                id: "rauno-me",
                title: "rauno.me",
                screenshot: "/doc-assets/docs/benchmarks/images/rauno-me.webp",
            },
        ]);
    });

    it("carries only the decision reports, not every collected doc", async () => {
        await artifact("docs", {
            pages: [
                {
                    path: "docs/decisions/0009-comment-discipline.md",
                    kind: "decision",
                    title: "🧭 Comments",
                    decisionStatus: "implemented",
                },
                { path: "README.md", kind: "readme", title: "Repo" },
            ],
        });

        const { decisions } = await handler({} as never);

        expect(decisions).toEqual([
            {
                id: "0009-comment-discipline",
                number: "0009",
                title: "Comments",
                status: "implemented",
            },
        ]);
    });
});
