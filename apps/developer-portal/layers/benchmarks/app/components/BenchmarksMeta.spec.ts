import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import BenchmarksMeta from "./BenchmarksMeta.vue";

const SITE = {
    path: "/docs/benchmarks/rauno-me",
    id: "rauno-me",
    title: "rauno.me",
    url: "https://rauno.me",
    kind: null,
    verdict: null,
    description: "",
} satisfies Benchmark;

describe("BenchmarksMeta", () => {
    it("links to the live site in a new tab", async () => {
        const wrapper = await mountSuspended(BenchmarksMeta, {
            props: { benchmark: SITE, source: "docs/benchmarks/rauno-me.md" },
        });

        const link = wrapper.find("a");
        expect(link.attributes("href")).toBe("https://rauno.me");
        expect(link.attributes("target")).toBe("_blank");
    });

    it("shows only the source for an entry that isn't in the library", async () => {
        const wrapper = await mountSuspended(BenchmarksMeta, {
            props: { benchmark: null, source: "docs/benchmarks/gone.md" },
        });

        expect(wrapper.text()).toBe("docs/benchmarks/gone.md");
    });
});
