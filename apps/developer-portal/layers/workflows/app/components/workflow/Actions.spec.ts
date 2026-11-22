import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import Actions from "./Actions.vue";

const MESSAGES = {
    workflowActions: {
        never: "Never synced — run {setup} then {sync}",
        settings: "Settings",
        synced: "Snapshot updated {age}",
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowActions", () => {
    it("gives the commands that set up and sync a project never synced", async () => {
        const wrapper = await mountSuspended(Actions, { props: { project: "blog", found: true } });

        expect(wrapper.text()).toContain("pnpm workflow:setup blog");
        expect(wrapper.text()).toContain("pnpm workflow:sync blog");
    });

    it("dates a synced snapshot instead", async () => {
        const wrapper = await mountSuspended(Actions, {
            props: { project: "blog", found: true, syncedAt: new Date().toISOString() },
        });

        expect(wrapper.text()).not.toContain("pnpm workflow:sync");
    });

    it("links to settings only for a project that has a file", async () => {
        const found = await mountSuspended(Actions, { props: { project: "blog", found: true } });
        expect(found.find("a[href='/workflows/blog/settings']").exists()).toBe(true);

        const missing = await mountSuspended(Actions, { props: { project: "blog", found: false } });
        expect(missing.find("a").exists()).toBe(false);
    });
});
