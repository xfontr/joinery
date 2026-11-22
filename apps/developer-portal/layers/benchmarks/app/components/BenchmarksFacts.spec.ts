import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import BenchmarksFacts from "./BenchmarksFacts.vue";

const site = (id: string, verdict: Benchmark["verdict"]): Benchmark => ({
    path: `/docs/benchmarks/${id}`,
    id,
    title: id,
    url: null,
    kind: null,
    verdict,
    description: "",
});

describe("BenchmarksFacts", () => {
    it("counts the sites and each verdict", async () => {
        const wrapper = await mountSuspended(BenchmarksFacts, {
            props: { benchmarks: [site("a", "strong"), site("b", "avoid"), site("c", "avoid")] },
        });

        expect(wrapper.findAll("[data-figure]").map((value) => value.text())).toEqual([
            "3",
            "1",
            "0",
            "2",
        ]);
    });
});
