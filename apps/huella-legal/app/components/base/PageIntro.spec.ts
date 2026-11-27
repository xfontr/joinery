import type { BreadcrumbItem } from "@nuxt/ui";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PageIntro from "./PageIntro.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

const props: { breadcrumbs: BreadcrumbItem[] } = {
    breadcrumbs: [
        { label: "Publicaciones", to: { name: "publications" } },
        { label: "Derecho penal" },
    ],
};

describe("page intro", () => {
    it("starts every breadcrumb at home and leaves the current page unlinked", async () => {
        const wrapper = await mountSuspended(PageIntro, { props, global });

        expect(wrapper.findAll("nav a").map((link) => link.attributes("href"))).toEqual([
            "/",
            "/publicaciones/",
        ]);
        expect(wrapper.find("nav").text()).toContain("Derecho penal");
    });
});
