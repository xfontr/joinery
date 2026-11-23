import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ViewSwitch from "./ViewSwitch.vue";

describe("ViewSwitch", () => {
    it("offers the developer portal and marks only the visitor view as current", async () => {
        const wrapper = await mountSuspended(ViewSwitch);

        expect(
            wrapper.findAll("a").map((link) => ({
                to: link.attributes("href"),
                current: link.attributes("aria-current") === "true",
            })),
        ).toEqual([
            { to: "/", current: true },
            { to: portalUrl("/"), current: false },
        ]);
    });
});
