import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ readArtifact: vi.fn() }));
const h3 = vi.hoisted(() => ({ defineEventHandler: (handler: unknown) => handler }));

vi.mock("../utils/store.ts", () => store);
vi.mock("h3", () => h3);

import handler from "./badges.get.ts";

const serve = (artifacts: Record<string, unknown>) =>
    store.readArtifact.mockImplementation((name: string) =>
        Promise.resolve(artifacts[name] ?? null),
    );

const NONE = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };

beforeEach(() => {
    vi.clearAllMocks();
});

describe("badges route", () => {
    it("reads every figure from its artifact", async () => {
        serve({
            deps: { advisories: [{ id: 1 }, { id: 2 }], vulnerabilities: { ...NONE, low: 2 } },
            coverage: { totals: { lines: 81 } },
            docs: { pages: [{}, {}, {}], brokenLinkCount: 4 },
            metrics: {
                branch: "master",
                commit: "abc1234def",
                generatedAt: "2026-11-18T10:00:00Z",
            },
        });

        await expect(handler({} as never)).resolves.toEqual({
            advisories: 2,
            worstSeverity: "low",
            lineCoverage: 81,
            docPages: 3,
            brokenLinks: 4,
            collected: { branch: "master", commit: "abc1234def", at: "2026-11-18T10:00:00Z" },
        });
    });

    it("names the most severe advisory, not the most common one", async () => {
        serve({ deps: { advisories: [], vulnerabilities: { ...NONE, low: 9, high: 1 } } });

        await expect(handler({} as never)).resolves.toMatchObject({ worstSeverity: "high" });
    });

    it("answers a never-collected snapshot with empty figures rather than throwing", async () => {
        serve({});

        await expect(handler({} as never)).resolves.toEqual({
            advisories: 0,
            worstSeverity: null,
            lineCoverage: null,
            docPages: null,
            brokenLinks: 0,
            collected: null,
        });
    });
});
