import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PageHeading from "./PageHeading.vue";

const props = { kicker: "Área · 12 publicaciones", title: "Derecho penal" };

describe("page heading", () => {
    it("draws no empty paragraph when there is no lead", async () => {
        const bare = await mountSuspended(PageHeading, { props });
        const led = await mountSuspended(PageHeading, {
            props: { ...props, lead: "Teoría del delito." },
        });

        expect(bare.find("p").exists()).toBe(false);
        expect(led.find("p").text()).toBe("Teoría del delito.");
    });
});
