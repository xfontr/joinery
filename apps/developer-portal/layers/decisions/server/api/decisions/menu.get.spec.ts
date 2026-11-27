import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";

vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

import handler from "./menu.get.ts";

const page = (number: string, status: DocPage["decisionStatus"]): DocPage => ({
    path: `docs/decisions/${number}-a-decision.md`,
    kind: "decision",
    title: `🔬 Decision ${number}`,
    words: 100,
    updatedAt: null,
    decisionStatus: status,
    decisionOutcome: "accepted",
    decisionSupersededBy: null,
    audit: null,
    brokenLinks: [],
});

let dir = "";

const artifact = (name: string, value: unknown) =>
    writeFile(join(dir, `${name}.json`), JSON.stringify(value));

beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "snapshot-"));
    vi.stubGlobal("useRuntimeConfig", () => ({ snapshotDir: dir }));
});

afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(dir, { recursive: true, force: true });
});

describe("decisions menu route", () => {
    it("lists only the decisions still to implement, newest first", async () => {
        await artifact("docs", {
            pages: [
                page("0003", "to-implement"),
                page("0007", "implemented"),
                page("0012", "to-implement"),
                page("0020", "wont-implement"),
            ],
        });

        await expect(handler({} as never)).resolves.toEqual([
            { label: "0012 Decision 0012", to: "/decisions/0012-a-decision" },
            { label: "0003 Decision 0003", to: "/decisions/0003-a-decision" },
        ]);
    });

    it("caps the list so a backlog can't push the rest of the sidebar off screen", async () => {
        await artifact("docs", {
            pages: Array.from({ length: 12 }, (_, index) =>
                page(String(index + 1).padStart(4, "0"), "to-implement"),
            ),
        });

        await expect(handler({} as never)).resolves.toHaveLength(8);
    });

    it("answers an empty menu when the docs were never collected", async () => {
        await expect(handler({} as never)).resolves.toEqual([]);
    });
});
