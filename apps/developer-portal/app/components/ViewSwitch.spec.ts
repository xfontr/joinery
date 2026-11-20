import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ViewSwitch from "./ViewSwitch.vue";

const links = async (current: "visitor" | "dev") => {
    const wrapper = await mountSuspended(ViewSwitch, { props: { current } });

    return wrapper.findAll("a").map((link) => ({
        to: link.attributes("href"),
        current: link.attributes("aria-current") === "true",
    }));
};

describe("ViewSwitch", () => {
    it("offers both views from the dev side, marking only the dev one as current", async () => {
        expect(await links("dev")).toEqual([
            { to: "/", current: false },
            { to: "/overview", current: true },
        ]);
    });

    it("marks only the visitor view as current from the visitor side", async () => {
        expect(await links("visitor")).toEqual([
            { to: "/", current: true },
            { to: "/overview", current: false },
        ]);
    });
});
