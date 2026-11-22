import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import ViewSwitch from "./ViewSwitch.vue";

const links = async (current: "visitor" | "dev") => {
    const wrapper = await mountSuspended(ViewSwitch, { props: { current } });

    return wrapper.findAll("a").map((link) => ({
        to: link.attributes("href"),
        current: link.attributes("aria-current") === "true",
    }));
};

const switchToDev = async () => {
    const wrapper = await mountSuspended(ViewSwitch, { props: { current: "visitor" } });
    await wrapper.find('a[href="/overview"]').trigger("click");
    await vi.waitUntil(() => useRouter().currentRoute.value.path === "/overview");
    return useRouter().currentRoute.value.path;
};

afterEach(async () => {
    Reflect.deleteProperty(document, "startViewTransition");
    await useRouter().push("/");
});

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

    it("still switches views in a browser without view transitions", async () => {
        expect(await switchToDev()).toBe("/overview");
    });

    it("switches views inside a view transition where the browser has one", async () => {
        const transition = vi.fn((update: () => Promise<void>) => {
            void update();
        });
        Object.assign(document, { startViewTransition: transition });

        expect(await switchToDev()).toBe("/overview");
        expect(transition).toHaveBeenCalledOnce();
    });
});
