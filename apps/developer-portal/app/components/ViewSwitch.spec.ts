import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ViewSwitch from "./ViewSwitch.vue";

describe("ViewSwitch", () => {
    it("offers the personal site and marks only the developer view as current", async () => {
        const wrapper = await mountSuspended(ViewSwitch);

        expect(
            wrapper.findAll("a").map((link) => ({
                to: link.attributes("href"),
                current: link.attributes("aria-current") === "true",
            })),
        ).toEqual([
            { to: useAppConfig().personalSite, current: false },
            { to: "/", current: true },
        ]);
    });
});
