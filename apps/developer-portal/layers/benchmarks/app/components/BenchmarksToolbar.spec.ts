import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import BenchmarksToolbar from "./BenchmarksToolbar.vue";

describe("BenchmarksToolbar", () => {
    it("offers every kind in the library, spelled out, after one for all of them", async () => {
        const wrapper = await mountSuspended(BenchmarksToolbar, {
            props: { search: "", verdict: "all", kind: "all", kinds: ["portfolio"] },
        });

        const kinds: { value: string }[] = wrapper
            .findAllComponents({ name: "USelect" })[1]
            ?.props("items");
        expect(kinds.map((item) => item.value)).toEqual(["all", "portfolio"]);
    });
});
