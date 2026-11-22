import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PageHeader from "./PageHeader.vue";

const trail = (wrapper: VueWrapper) =>
    wrapper
        .findAll(
            "nav[aria-label='Breadcrumb'] a, nav[aria-label='Breadcrumb'] span:not([aria-hidden])",
        )
        .map((crumb) => crumb.text());

describe("PageHeader", () => {
    it("traces the page back through its app to the portal, ending on the crumbs given", async () => {
        const wrapper = await mountSuspended(PageHeader, {
            props: { title: "Decision", crumbs: [{ label: "0009" }] },
            route: "/decisions/0009-comment-discipline",
        });

        const crumbs = trail(wrapper);
        expect(crumbs[0]).toBe("monorepo");
        expect(crumbs).toHaveLength(3);
        expect(crumbs.at(-1)).toBe("0009");
    });

    it("draws no breadcrumb on a page with nothing above it but the portal", async () => {
        const wrapper = await mountSuspended(PageHeader, {
            props: { title: "Home" },
            route: "/overview",
        });

        expect(wrapper.find("nav[aria-label='Breadcrumb']").exists()).toBe(false);
    });

    it("lets a page replace the title and add actions", async () => {
        const wrapper = await mountSuspended(PageHeader, {
            props: { title: "Plain" },
            slots: { title: () => "Custom title", actions: () => "Action placeholder" },
        });

        expect(wrapper.find("h1").exists()).toBe(false);
        expect(wrapper.text()).toContain("Custom title");
        expect(wrapper.text()).toContain("Action placeholder");
    });
});
