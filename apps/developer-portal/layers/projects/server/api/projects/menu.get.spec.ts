import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

const store = vi.hoisted(() => ({ readArtifact: vi.fn() }));
const h3 = vi.hoisted(() => ({ defineEventHandler: (handler: unknown) => handler }));

vi.mock("#layers/snapshot/server/utils/store.ts", () => store);
vi.mock("h3", () => h3);

import handler from "./menu.get.ts";

const node = (root: string): ProjectNode => ({
    name: `@monorepo/${root.split("/")[1]}`,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const metric = (root: string, coverageLinesPct: number | null): ProjectMetrics => ({
    name: `@monorepo/${root.split("/")[1]}`,
    root,
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
});

const artifacts = (projects: ProjectNode[], metrics: ProjectMetrics[]) =>
    store.readArtifact.mockImplementation(async (name: string) =>
        name === "projects" ? { projects } : { projects: metrics },
    );

beforeEach(() => {
    vi.clearAllMocks();
});

describe("projects menu route", () => {
    it("counts every kind and leaves out a kind with no project", async () => {
        artifacts([node("packages/ui"), node("apps/portal"), node("apps/blog")], []);

        const rows = await handler({} as never);

        expect(rows.map(({ label, to, badge }) => ({ label, to, badge }))).toEqual([
            { label: "All projects", to: "/projects", badge: "3" },
            { label: "Apps", to: "/projects?kind=apps", badge: "2" },
            { label: "Packages", to: "/projects?kind=packages", badge: "1" },
        ]);
    });

    it("lists a kind's projects by folder with their rounded line coverage, a dash when uncollected", async () => {
        artifacts([node("apps/portal"), node("apps/blog")], [metric("apps/portal", 81.6)]);

        const [, apps] = await handler({} as never);

        expect(apps).toMatchObject({
            children: [
                { to: "/projects/blog", badge: "—", coverage: null },
                { to: "/projects/portal", badge: "82%", coverage: 81.6 },
            ],
        });
    });
});
