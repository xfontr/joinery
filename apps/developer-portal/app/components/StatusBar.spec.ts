import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { StatusItem } from "~/types/StatusItem";
import StatusBar from "./StatusBar.vue";

const item = (id: string, tone: StatusItem["tone"]): StatusItem => ({
    id,
    label: id,
    value: "3",
    detail: "open",
    tone,
    to: `/${id}`,
});

describe("StatusBar", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("en", {
            statusBar: { collected: "{'@'}{commit} collected {at}" },
        });
    });

    it("names the collected branch and its short commit", async () => {
        const wrapper = await mountSuspended(StatusBar, {
            props: {
                collected: { branch: "master", commit: "abcdef1234", at: new Date().toISOString() },
                items: [],
            },
        });

        expect(wrapper.text()).toContain("master");
        expect(wrapper.text()).toContain("@abcdef1");
        expect(wrapper.text()).not.toContain("abcdef12");
    });

    it("says the portal was never collected instead of naming a branch", async () => {
        const wrapper = await mountSuspended(StatusBar, { props: { collected: null, items: [] } });

        expect(wrapper.text()).toContain("statusBar.neverCollected");
    });

    it("keeps a warning in view on a narrow screen and folds a quiet item away", async () => {
        const wrapper = await mountSuspended(StatusBar, {
            props: {
                collected: null,
                items: [item("issues", "neutral"), item("coverage", "warn")],
            },
        });

        const [quiet, warning] = wrapper.findAll("li");
        expect(quiet?.classes()).toContain("hidden");
        expect(warning?.classes()).not.toContain("hidden");
        expect(warning?.find("a").attributes("href")).toBe("/coverage");
    });
});
