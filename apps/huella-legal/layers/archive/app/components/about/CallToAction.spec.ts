import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutCallToAction from "./CallToAction.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about call to action", () => {
    it("holds its fingerprint's draw until it scrolls into view", async () => {
        const wrapper = await mountSuspended(AboutCallToAction, { global });

        expect(wrapper.find(".hl-about-fingerprint").attributes("data-waiting")).toBe("true");
    });

    it("leads to publishing and to contact", async () => {
        const wrapper = await mountSuspended(AboutCallToAction, { global });

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual([
            "/publicar/",
            "/contacto/",
        ]);
    });
});
