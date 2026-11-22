import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { UnsortedIssue } from "#layers/workflows/shared/workflows.ts";
import Alerts from "./Alerts.vue";

const MESSAGES = {
    workflowAlerts: {
        blank: {
            description:
                "Ask Claude to draft its map: it asks what the project is, writes the blocks under {extras} in {file}, and they show here for you to check before anything is filed.",
            title: "This project has no blocks yet",
        },
        problems: "This project's files have problems",
        reasons: {
            noLabel: "no {detail} label",
        },
        unsorted: {
            lead: "Not placed yet. Give each one the milestone and a {label} label on GitHub, then sync again.",
            title: "{count} to organise",
        },
    },
};

const STRAY = {
    issue: {
        number: 12,
        title: "Stray ticket",
        url: "https://github.com/acme/repo/issues/12",
        state: "open",
        reason: null,
        caps: [],
        createdAt: null,
        closedAt: null,
        activity: [],
        blockedBy: [],
        branch: false,
        pr: false,
        owner: false,
        complexity: null,
    },
    reason: "noLabel",
    detail: "cap:",
} satisfies UnsortedIssue;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowAlerts", () => {
    it("says nothing for a project with blocks, clean files and every ticket placed", async () => {
        const wrapper = await mountSuspended(Alerts, {
            props: { project: "blog", blank: false, problems: [], unsorted: [] },
        });

        expect(wrapper.text()).toBe("");
    });

    it("points a blank project at the file its blocks go in", async () => {
        const wrapper = await mountSuspended(Alerts, {
            props: { project: "blog", blank: true, problems: [], unsorted: [] },
        });

        expect(wrapper.text()).toContain("data/workflows/projects/blog.yaml");
    });

    it("lists each file problem and each ticket still to place, with why", async () => {
        const wrapper = await mountSuspended(Alerts, {
            props: {
                project: "blog",
                blank: false,
                problems: ["blog.yaml: bad"],
                unsorted: [STRAY],
            },
        });

        expect(wrapper.text()).toContain("blog.yaml: bad");
        expect(wrapper.find("a[href$='/issues/12']").exists()).toBe(true);
        expect(wrapper.text()).toContain("no cap: label");
    });
});
