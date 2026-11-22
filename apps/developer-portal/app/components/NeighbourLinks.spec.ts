import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import NeighbourLinks from "./NeighbourLinks.vue";

describe("NeighbourLinks", () => {
    it("links both neighbours under the labels given", async () => {
        const wrapper = await mountSuspended(NeighbourLinks, {
            props: {
                previous: { to: "/wiki/a", title: "A" },
                next: { to: "/wiki/c", title: "C" },
                before: "Before placeholder",
                after: "After placeholder",
            },
        });

        const links = wrapper.findAll("a");
        expect(links.map((link) => link.attributes("href"))).toEqual(["/wiki/a", "/wiki/c"]);
        expect(links[0]?.text()).toContain("Before placeholder");
    });

    it("keeps a lone next link in the right-hand column", async () => {
        const wrapper = await mountSuspended(NeighbourLinks, {
            props: { previous: null, next: { to: "/wiki/c", title: "C" }, before: "", after: "" },
        });

        expect(wrapper.findAll("a")).toHaveLength(1);
        expect(wrapper.find("a").classes()).toContain("sm:col-start-2");
    });
});
