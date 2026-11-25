import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import DefaultLayout from "./default.vue";

const menuLinks = () => [...document.body.querySelectorAll<HTMLAnchorElement>("[data-menu-link]")];

const openMenu = async (route: string) => {
    const wrapper = await mountSuspended(DefaultLayout, { route });
    await wrapper.get("header button").trigger("click");
    await new Promise((resolve) => setTimeout(resolve));
    return wrapper;
};

describe("default layout", () => {
    it.each([
        { route: "/work", marked: ["/work"] },
        { route: "/work/huella-legal", marked: ["/work"] },
        { route: "/", marked: [] },
    ])("marks the menu's section for $route as the current page", async ({ route, marked }) => {
        await openMenu(route);

        const current = menuLinks()
            .filter((link) => link.getAttribute("aria-current") === "page")
            .map((link) => link.getAttribute("href"));

        expect(menuLinks()).toHaveLength(4);
        expect(current).toEqual(marked);
    });

    it("closes the menu once a section in it is chosen", async () => {
        await openMenu("/");

        menuLinks()[0]!.click();
        await new Promise((resolve) => setTimeout(resolve));

        expect(menuLinks()).toEqual([]);
    });
});
