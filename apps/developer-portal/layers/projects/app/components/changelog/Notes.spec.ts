import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import Notes from "./Notes.vue";

const MESSAGES = {
    changelogNotes: {
        conventional: {
            description: "{percent}% of the last 100 commits parse as a version bump.",
            title: "Conventional subjects",
        },
        unreleased: {
            description: "{projects} — commits waiting on a first release, so no changelog yet.",
            title: "Never released",
        },
    },
};

const metric = (root: string, values: Partial<ProjectMetrics>): ProjectMetrics => ({
    name: root,
    root,
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
    ...values,
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ChangelogNotes", () => {
    it("names only the projects with commits and no changelog", async () => {
        const wrapper = await mountSuspended(Notes, {
            props: {
                projects: [
                    metric("apps/blog", { unreleasedCommits: 4 }),
                    metric("packages/ui", { unreleasedCommits: 2, hasChangelog: true }),
                    metric("packages/idle", {}),
                ],
                conventional: null,
            },
        });

        expect(wrapper.text()).toContain("Blog");
        expect(wrapper.text()).not.toContain("Ui");
        expect(wrapper.text()).not.toContain("Idle");
    });

    it("gives the share of commit subjects that parse, and nothing when none was collected", async () => {
        const parsed = await mountSuspended(Notes, { props: { projects: [], conventional: 87 } });
        expect(parsed.text()).toContain("87%");

        const missing = await mountSuspended(Notes, {
            props: { projects: [], conventional: null },
        });
        expect(missing.text()).toBe("");
    });
});
