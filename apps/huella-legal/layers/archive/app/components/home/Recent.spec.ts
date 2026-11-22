import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import HomeRecent from "./Recent.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("home recent", () => {
    it("names its region by its own heading", async () => {
        const wrapper = await mountSuspended(HomeRecent, { props: { articles: [] }, global });
        const labelledBy = wrapper.find("section").attributes("aria-labelledby");

        expect(labelledBy).toBeTruthy();
        expect(wrapper.find("h2").attributes("id")).toBe(labelledBy);
    });

    it("leads to every publication", async () => {
        const wrapper = await mountSuspended(HomeRecent, { props: { articles: [] }, global });

        expect(wrapper.find("a").attributes("href")).toBe("/publicaciones/");
    });
});
