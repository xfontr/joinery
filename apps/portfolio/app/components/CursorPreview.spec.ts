import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import CursorPreview from "./CursorPreview.vue";

const pointer = (fine: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: fine && query.includes("pointer: fine"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));

afterEach(() => {
    vi.unstubAllGlobals();
});

const open = (subject: string | null) =>
    mountSuspended(CursorPreview, {
        props: { subject },
        slots: { default: (props: { subject: string | null }) => h("p", props.subject ?? "") },
    });

describe("CursorPreview", () => {
    it("stays off the page without a fine pointer, so a tap never leaves a card behind", async () => {
        pointer(false);
        const wrapper = await open("look");

        expect(wrapper.find("[data-cursor-preview]").exists()).toBe(false);
    });

    it("hides the card from assistive tech, since the row it decorates already says it all", async () => {
        pointer(true);
        const wrapper = await open(null);
        await wrapper.setProps({ subject: "look" });

        const card = wrapper.find("[data-cursor-preview]");
        expect(card.attributes("aria-hidden")).toBe("true");
        expect(card.text()).toBe("look");
    });

    it("shows the newly hovered subject when the pointer moves to the next row", async () => {
        pointer(true);
        const wrapper = await open(null);
        await wrapper.setProps({ subject: "look" });
        await wrapper.setProps({ subject: "decide" });

        await vi.waitFor(() => expect(wrapper.find("[data-cursor-preview]").text()).toBe("decide"));
    });

    it("pins a corner of the card to the pointer as it moves, since the card stands in for it", async () => {
        pointer(true);
        const wrapper = await open("look");

        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 60 }));

        await vi.waitFor(() =>
            expect(
                (wrapper.find("[data-cursor-preview]").element as HTMLElement).style.transform,
            ).toBe("translate(40px, 60px)"),
        );
    });

    it("drops the card on scroll, since the row under a still pointer never reports leaving", async () => {
        pointer(true);
        const wrapper = await open("look");
        const card = () => wrapper.find("[data-cursor-preview]");

        window.dispatchEvent(new Event("scroll"));
        await vi.waitFor(() => expect(card().exists()).toBe(false));

        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 60 }));
        await vi.waitFor(() => expect(card().exists()).toBe(true));
    });

    it("hides the real pointer only while the card stands in for it", async () => {
        pointer(true);
        const wrapper = await open(null);
        const hidden = () => document.documentElement.hasAttribute("data-cursor-hidden");

        await wrapper.setProps({ subject: "look" });
        expect(hidden()).toBe(true);

        await wrapper.setProps({ subject: null });
        expect(hidden()).toBe(false);
    });
});
