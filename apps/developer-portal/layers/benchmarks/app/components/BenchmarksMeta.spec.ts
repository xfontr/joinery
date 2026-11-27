import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import BenchmarksMeta from "./BenchmarksMeta.vue";

describe("BenchmarksMeta", () => {
    it("shows only the source for an entry that isn't in the library", async () => {
        const wrapper = await mountSuspended(BenchmarksMeta, {
            props: { benchmark: null, source: "docs/benchmarks/gone.md" },
        });

        expect(wrapper.text()).toBe("docs/benchmarks/gone.md");
    });
});
