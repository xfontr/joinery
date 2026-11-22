import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { Issue } from "#layers/github/app/utils/issues.ts";
import IssuesTab from "./IssuesTab.vue";

const MESSAGES = {
    projectIssuesTab: {
        meta: "GitHub · labelled {area}",
        none: "No open issue is labelled {area}.",
        reading: "Reading GitHub…",
        readingIssues: "Reading open issues…",
        title: "Open issues",
    },
};

const ISSUE = {
    number: 42,
    title: "Fix the rail",
    body: "",
    url: "https://github.com/acme/repo/issues/42",
    labels: ["package:ui"],
    assignees: [],
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-02T00:00:00Z",
} satisfies Issue;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ProjectIssuesTab", () => {
    it("links each issue to GitHub with its number and age", async () => {
        const wrapper = await mountSuspended(IssuesTab, {
            props: { issues: [{ ...ISSUE, age: "3d" }], read: true, area: "package:ui" },
        });

        const link = wrapper.find("a");
        expect(link.attributes("href")).toBe(ISSUE.url);
        expect(link.text()).toMatch(/#42\s*Fix the rail\s*3d/);
    });

    it("says nothing is filed only once GitHub has answered", async () => {
        const reading = await mountSuspended(IssuesTab, {
            props: { issues: [], read: false, area: "package:ui" },
        });

        expect(reading.text()).not.toContain("No open issue is labelled package:ui");
    });

    it("names the label it looked under when GitHub answers with none", async () => {
        const wrapper = await mountSuspended(IssuesTab, {
            props: { issues: [], read: true, area: "package:ui" },
        });

        expect(wrapper.text()).toContain("package:ui");
        expect(wrapper.find("ul").exists()).toBe(false);
    });
});
