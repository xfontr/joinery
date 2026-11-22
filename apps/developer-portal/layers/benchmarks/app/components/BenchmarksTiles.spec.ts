import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import BenchmarksTiles from "./BenchmarksTiles.vue";

const site = (id: string, verdict: Benchmark["verdict"]): Benchmark => ({
    path: `/docs/benchmarks/${id}`,
    id,
    title: id,
    url: null,
    kind: null,
    verdict,
    description: "",
});

describe("BenchmarksTiles", () => {
    it("counts the sites and each verdict", async () => {
        const wrapper = await mountSuspended(BenchmarksTiles, {
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
