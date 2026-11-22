import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Feature } from "#layers/workflows/shared/workflows.ts";
import Features from "./Features.vue";

const SEARCH = {
    id: "search",
    title: "Search",
    summary: "",
    enabled: false,
    blocks: [{ title: "Search", complexity: 3 }],
    points: 3,
    within: null,
} satisfies Feature;

describe("SettingsFeatures", () => {
    it("passes a switch flipped on up to the page", async () => {
        const wrapper = await mountSuspended(Features, {
            props: { features: [SEARCH], editable: true },
        });

        await wrapper.find("[role='switch']").trigger("click");

        expect(wrapper.emitted("toggle")).toEqual([["search", true]]);
    });
});
