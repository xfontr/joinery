import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import List from "./List.vue";

const MESSAGES = {
    changelogList: {
        unreleased: "+{count} unreleased",
        version: "v{version}",
    },
};

const UI = {
    name: "@joinery/ui",
    root: "packages/ui",
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: 3,
    currentVersion: "1.4.0",
    hasChangelog: true,
} satisfies ProjectMetrics;

const CHANGELOGS = [{ path: "/packages/ui/changelog" }, { path: "/packages/content/changelog" }];

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ChangelogList", () => {
    it("names each changelog by project with its version and unreleased commits", async () => {
        const wrapper = await mountSuspended(List, {
            props: { changelogs: CHANGELOGS, projects: [UI], modelValue: null },
        });

        const entries = wrapper.findAll("button").map((entry) => entry.text());
        expect(entries[0]).toMatch(/v1\.4\.0\s*\+3 unreleased/);
        expect(entries[1]).toBe("Content");
    });
});
