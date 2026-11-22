import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutTopics from "./Topics.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about topics", () => {
    it("leads to the subject index", async () => {
        const wrapper = await mountSuspended(AboutTopics, { global });

        expect(wrapper.find("a").attributes("href")).toBe("/areas/");
    });
});
