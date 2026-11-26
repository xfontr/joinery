import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppTabs from "./AppTabs.vue";

const tabs = (wrapper: VueWrapper) =>
    wrapper.findAll("nav a").map((tab) => ({
        to: tab.attributes("href"),
        current: tab.attributes("aria-current") ?? null,
    }));

describe("AppTabs", () => {
    it("lists the app's sibling pages and marks the one being read", async () => {
        const wrapper = await mountSuspended(AppTabs, { route: "/deps" });

        expect(tabs(wrapper)).toEqual([
            { to: "/coverage", current: null },
            { to: "/deps", current: "page" },
            { to: "/telemetry", current: null },
        ]);
    });

    it("renders nothing under an app that does not show its pages as tabs", async () => {
        const wrapper = await mountSuspended(AppTabs, { route: "/" });

        expect(wrapper.find("nav").exists()).toBe(false);
    });
});
