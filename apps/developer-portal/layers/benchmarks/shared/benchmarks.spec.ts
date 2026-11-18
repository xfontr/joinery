import { describe, expect, it } from "vitest";
import type { BenchmarkPage } from "./benchmarks.ts";
import {
    countByVerdict,
    filterBenchmarks,
    kindsOf,
    screenshotOf,
    sortBenchmarks,
    toBenchmarks,
} from "./benchmarks.ts";

const PAGES: BenchmarkPage[] = [
    { path: "/docs/benchmarks/readme", title: "🔖 Benchmarks" },
    { path: "/docs/benchmarks/template", title: "🔖", kind: "<one kind>", verdict: "<x>" },
    {
        path: "/docs/benchmarks/rauno-me",
        title: "🔖 rauno.me",
        url: "https://rauno.me",
        kind: "portfolio",
        verdict: "strong",
        description: "Strong reference. One sentence.",
    },
    {
        path: "/docs/benchmarks/primer-style",
        title: "🔖 Primer",
        kind: "design-system",
        verdict: "partial",
    },
    {
        path: "/docs/benchmarks/autopilot",
        title: "🔖 Autopilot",
        kind: "product",
        verdict: "avoid",
    },
    { path: "/docs/benchmarks/odd", title: "🔖 Odd", kind: "portfolio", verdict: "maybe" },
    { path: "/docs/decisions/0001-first", title: "🧭 First" },
];

const benchmarks = toBenchmarks(PAGES);

describe("toBenchmarks", () => {
    it("lists only the sites, not the folder's README, its TEMPLATE or another folder's docs", () => {
        expect(benchmarks.map((benchmark) => benchmark.id)).toEqual([
            "rauno-me",
            "primer-style",
            "autopilot",
            "odd",
        ]);
    });

    it("drops the verdict label the entry opens with, which the pill beside it already says", () => {
        expect(benchmarks[0]?.description).toBe("One sentence.");
    });

    it("strips the heading emoji from the title", () => {
        expect(benchmarks[0]?.title).toBe("rauno.me");
    });

    it("leaves a verdict outside the vocabulary unset instead of passing it through", () => {
        expect(benchmarks.find((benchmark) => benchmark.id === "odd")?.verdict).toBeNull();
    });
});

describe("screenshotOf", () => {
    it("points at the image named after the entry's file, where the build serves it", () => {
        expect(screenshotOf(benchmarks[0]!)).toBe(
            "/doc-assets/docs/benchmarks/images/rauno-me.webp",
        );
    });
});

describe("filterBenchmarks", () => {
    it("keeps only the verdict asked for", () => {
        expect(filterBenchmarks(benchmarks, { verdict: "avoid" }).map((b) => b.id)).toEqual([
            "autopilot",
        ]);
    });

    it("keeps only the kind asked for", () => {
        expect(filterBenchmarks(benchmarks, { kind: "portfolio" }).map((b) => b.id)).toEqual([
            "rauno-me",
            "odd",
        ]);
    });

    it("searches the verdict sentence too, not only the name", () => {
        expect(filterBenchmarks(benchmarks, { search: "one sentence" }).map((b) => b.id)).toEqual([
            "rauno-me",
        ]);
    });
});

describe("sortBenchmarks", () => {
    it("puts the strongest references first and an unparsed verdict last", () => {
        expect(sortBenchmarks(benchmarks).map((benchmark) => benchmark.id)).toEqual([
            "rauno-me",
            "primer-style",
            "autopilot",
            "odd",
        ]);
    });
});

describe("countByVerdict", () => {
    it("counts every verdict, including one no entry carries", () => {
        expect(countByVerdict(benchmarks.slice(0, 1))).toEqual({ strong: 1, partial: 0, avoid: 0 });
    });
});

describe("kindsOf", () => {
    it("lists each kind once, sorted, for the filter", () => {
        expect(kindsOf(benchmarks)).toEqual(["design-system", "portfolio", "product"]);
    });
});
