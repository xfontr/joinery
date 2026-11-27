import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import Actions from "./Actions.vue";

const MESSAGES = {
    workflowActions: {
        never: "Never synced",
        settings: "Settings",
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowActions", () => {
    it("says only a project never synced is never synced", async () => {
        const never = await mountSuspended(Actions, { props: { project: "blog", found: true } });
        expect(never.text()).toContain("Never synced");

        const synced = await mountSuspended(Actions, {
            props: { project: "blog", found: true, syncedAt: new Date().toISOString() },
        });
        expect(synced.text()).not.toContain("Never synced");
    });

    it("links to settings only for a project that has a file", async () => {
        const found = await mountSuspended(Actions, { props: { project: "blog", found: true } });
        expect(found.find("a[href='/workflows/blog/settings']").exists()).toBe(true);

        const missing = await mountSuspended(Actions, { props: { project: "blog", found: false } });
        expect(missing.find("a").exists()).toBe(false);
    });
});
