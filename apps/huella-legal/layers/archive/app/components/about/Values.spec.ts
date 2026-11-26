import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutValues from "./Values.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about values", () => {
    it("titles each value under the section heading, in order", async () => {
        const wrapper = await mountSuspended(AboutValues, { global });

        expect(wrapper.findAll("li h3").map((title) => title.text())).toEqual([
            "t(aboutValues.rigour.title)",
            "t(aboutValues.clarity.title)",
            "t(aboutValues.usefulness.title)",
        ]);
    });

    it("hands each value its place in the reveal stagger", async () => {
        const wrapper = await mountSuspended(AboutValues, { global });

        expect(wrapper.findAll("li").map((item) => item.attributes("style"))).toEqual([
            "--step: 0;",
            "--step: 1;",
            "--step: 2;",
        ]);
    });
});
