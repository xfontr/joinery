import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { WORK } from "#layers/projects/shared/work.ts";
import Page from "./index.vue";

describe("/work", () => {
    it("links every case in the work data to its own page", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work" });

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(WORK.map((item) => `/work/${item.slug}`));
    });

    it("shows each case's screenshot, so none renders as a broken image", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work" });

        const sources = wrapper.findAll("img").map((image) => image.attributes("src"));
        expect(sources).toHaveLength(WORK.length);
        expect(sources.every(Boolean)).toBe(true);
    });
});
