import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutModel from "./Model.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about model", () => {
    it("titles each point of the model under the section heading, in order", async () => {
        const wrapper = await mountSuspended(AboutModel, { global });

        expect(wrapper.findAll("li h3").map((title) => title.text())).toEqual([
            "t(aboutModel.freeToRead.title)",
            "t(aboutModel.openToWriters.title)",
            "t(aboutModel.independent.title)",
        ]);
    });

    it("hands each point its place in the reveal stagger", async () => {
        const wrapper = await mountSuspended(AboutModel, { global });

        expect(wrapper.findAll("li").map((item) => item.attributes("style"))).toEqual([
            "--step: 0;",
            "--step: 1;",
            "--step: 2;",
        ]);
    });
});
