import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

import handler from "./menu.get.ts";

const node = (root: string): ProjectNode => ({
    name: `@joinery/${root.split("/")[1]}`,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const metric = (root: string, coverageLinesPct: number | null): ProjectMetrics => ({
    name: `@joinery/${root.split("/")[1]}`,
    root,
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
});

let dir = "";

const artifact = (name: string, value: unknown) =>
    writeFile(join(dir, `${name}.json`), JSON.stringify(value));

const artifacts = async (projects: ProjectNode[], metrics: ProjectMetrics[]) => {
    await artifact("projects", { projects });
    await artifact("metrics", { projects: metrics });
};

beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "snapshot-"));
    vi.stubGlobal("useRuntimeConfig", () => ({ snapshotDir: dir }));
});

afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(dir, { recursive: true, force: true });
});

describe("projects menu route", () => {
    it("counts every kind and leaves out a kind with no project", async () => {
        await artifacts([node("packages/ui"), node("apps/portal"), node("apps/blog")], []);

        const rows = await handler({} as never);

        expect(rows.map(({ labelKey, to, badge }) => ({ labelKey, to, badge }))).toEqual([
            { labelKey: "app.menu.allProjects", to: "/projects", badge: "3" },
            { labelKey: "app.menu.kinds.apps", to: "/projects?kind=apps", badge: "2" },
            { labelKey: "app.menu.kinds.packages", to: "/projects?kind=packages", badge: "1" },
        ]);
    });

    it("lists a kind's projects by folder with their rounded line coverage, a dash when uncollected", async () => {
        await artifacts([node("apps/portal"), node("apps/blog")], [metric("apps/portal", 81.6)]);

        const [, apps] = await handler({} as never);

        expect(apps).toMatchObject({
            children: [
                { to: "/projects/blog", badge: "—", coverage: null },
                { to: "/projects/portal", badge: "82%", coverage: 81.6 },
            ],
        });
    });
});
