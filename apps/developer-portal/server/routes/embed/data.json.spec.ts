import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ readArtifact: vi.fn() }));
const workflows = vi.hoisted(() => ({ loadWorkflows: vi.fn() }));
const content = vi.hoisted(() => {
    const pages = vi.fn();
    const query = { where: () => query, select: () => query, all: pages };
    return { pages, queryCollection: () => query };
});

vi.mock("#layers/snapshot/server/utils/store.ts", () => store);
vi.mock("#layers/workflows/server/utils/workflows.ts", () => workflows);
vi.mock("@nuxt/content/server", () => content);
vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

import handler from "./data.json.ts";

beforeEach(() => {
    vi.clearAllMocks();
    content.pages.mockResolvedValue([]);
    store.readArtifact.mockResolvedValue(null);
    workflows.loadWorkflows.mockResolvedValue({ templates: [], projects: [] });
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
        store.readArtifact.mockImplementation(async (name: string) =>
            name === "docs"
                ? {
                      pages: [
                          {
                              path: "docs/decisions/0009-comment-discipline.md",
                              kind: "decision",
                              title: "🧭 Comments",
                              decisionStatus: "implemented",
                          },
                          { path: "README.md", kind: "readme", title: "Repo" },
                      ],
                  }
                : null,
        );

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
