import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PersonalSiteLink from "./PersonalSiteLink.vue";

describe("PersonalSiteLink", () => {
    it("links to the personal site from the element the reveal starts at", async () => {
        const wrapper = await mountSuspended(PersonalSiteLink);
        const link = wrapper.get("a");

        expect(link.attributes("href")).toBe(useAppConfig().personalSite);
        expect(link.attributes()).toHaveProperty("data-view-switch");
    });
});
