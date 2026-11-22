import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import HomePublishPrompt from "./PublishPrompt.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("home publish prompt", () => {
    it("leads to publishing", async () => {
        const wrapper = await mountSuspended(HomePublishPrompt, { global });

        expect(wrapper.find("a").attributes("href")).toBe("/publicar/");
    });
});
