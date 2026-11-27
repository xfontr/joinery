import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TagPill from "./TagPill.vue";

const global = {
    mocks: {
        $t: (key: string, params: Record<string, unknown>) =>
            `t(${key}, ${JSON.stringify(params)})`,
    },
};

describe("tag pill", () => {
    it("marks the active pill as the current page, which Nuxt UI skips for a forced active", async () => {
        const active = await mountSuspended(TagPill, {
            props: { label: "Derecho penal", to: "/areas/penal", active: true },
            global,
        });
        const idle = await mountSuspended(TagPill, {
            props: { label: "Derecho civil", to: "/areas/civil" },
            global,
        });

        expect(active.find("a").attributes("aria-current")).toBe("page");
        expect(idle.find("a").attributes("aria-current")).toBeUndefined();
    });

    it("reads the count as a phrase, since a bare number means nothing out loud", async () => {
        const wrapper = await mountSuspended(TagPill, {
            props: { label: "Derecho penal", to: "/areas/penal", count: 12 },
            global,
        });

        expect(wrapper.find("[aria-hidden=true]").text()).toBe("12");
        expect(wrapper.find(".sr-only").text()).toBe('t(tagPill.count, {"count":12})');
    });
});
