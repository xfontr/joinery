import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuditFinding } from "#layers/snapshot/shared/audits.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";

vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

import handler from "./menu.get.ts";

const row = (id: string, status: AuditFinding["status"]): AuditFinding => ({
    id,
    category: "Bugs",
    status,
    ref: null,
});

const page = (date: string, findings: AuditFinding[]): DocPage => ({
    path: `docs/audits/${date}-portal.md`,
    kind: "audit",
    title: `🔎 Audit of ${date}`,
    words: 100,
    updatedAt: null,
    decisionStatus: null,
    decisionOutcome: null,
    decisionSupersededBy: null,
    audit: { scope: "@joinery/developer-portal", commit: "61b6f7f", findings },
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

describe("audits menu route", () => {
    it("lists the audits with findings still open, newest first, counting what is owed", async () => {
        await artifact("docs", {
            pages: [
                page("2026-09-20", [row("B1", "open"), row("B2", "open")]),
                page("2026-09-25", [row("B1", "fixed")]),
                page("2026-10-01", [row("B1", "fixed"), row("B2", null)]),
            ],
        });

        await expect(handler({} as never)).resolves.toEqual([
            { label: "Audit of 2026-10-01", to: "/audits/2026-10-01-portal", badge: "1" },
            { label: "Audit of 2026-09-20", to: "/audits/2026-09-20-portal", badge: "2" },
        ]);
    });

    it("answers an empty menu when the docs were never collected", async () => {
        await expect(handler({} as never)).resolves.toEqual([]);
    });
});
