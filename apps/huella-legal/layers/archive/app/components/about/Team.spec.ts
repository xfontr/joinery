import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutTeam from "./Team.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about team", () => {
    it("leads to the collaborators", async () => {
        const wrapper = await mountSuspended(AboutTeam, { global });

        expect(wrapper.find("a").attributes("href")).toBe("/colaboradores/");
    });
});
