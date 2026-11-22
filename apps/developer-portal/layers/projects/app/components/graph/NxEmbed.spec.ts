import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import NxEmbed from "./NxEmbed.vue";

describe("GraphNxEmbed", () => {
    it("embeds the vendored Nx graph from the collector's folder", async () => {
        const wrapper = await mountSuspended(NxEmbed);

        expect(wrapper.find("iframe").attributes("src")).toMatch(/\/embed\/graph\/index\.html$/);
    });
});
