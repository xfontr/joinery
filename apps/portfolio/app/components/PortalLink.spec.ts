import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PortalLink from "./PortalLink.vue";

describe("PortalLink", () => {
    it("links to the developer portal from the element the reveal starts at", async () => {
        const wrapper = await mountSuspended(PortalLink);
        const link = wrapper.get("a");

        expect(link.attributes("href")).toBe(portalUrl("/"));
        expect(link.attributes()).toHaveProperty("data-view-switch");
    });
});
