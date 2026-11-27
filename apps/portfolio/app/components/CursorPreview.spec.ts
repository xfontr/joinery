import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { h, nextTick } from "vue";
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

    it("drops the card on scroll, since the row under a still pointer never reports leaving", async () => {
        pointer(true);
        const wrapper = await open("look");
        const card = () => wrapper.find("[data-cursor-preview]");

        window.dispatchEvent(new Event("scroll"));
        await nextTick();
        expect(card().exists()).toBe(false);

        window.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 60 }));
        await nextTick();
        expect(card().exists()).toBe(true);
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
