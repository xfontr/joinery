import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import BenchmarksCard from "./BenchmarksCard.vue";

const SITE = {
    path: "/docs/benchmarks/rauno-me",
    id: "rauno-me",
    title: "rauno.me",
    url: "https://rauno.me",
    kind: "portfolio",
    verdict: "strong",
    description: "Placeholder verdict",
} satisfies Benchmark;

describe("BenchmarksCard", () => {
    it("links to the entry with its screenshot named for the site", async () => {
        const wrapper = await mountSuspended(BenchmarksCard, { props: { benchmark: SITE } });

        expect(wrapper.find("a").attributes("href")).toBe("/benchmarks/rauno-me");
        expect(wrapper.find("img").attributes("alt")).toContain("rauno.me");
        expect(wrapper.find("img").attributes("src")).toContain("rauno-me");
    });

    it("leaves out the verdict and kind an entry doesn't give", async () => {
        const wrapper = await mountSuspended(BenchmarksCard, {
            props: { benchmark: { ...SITE, verdict: null, kind: null } },
        });

        expect(wrapper.findComponent({ name: "StatusPill" }).exists()).toBe(false);
    });
});
