import type { Benchmark } from "../types/Benchmark.ts";
import type { BenchmarkVerdict } from "../types/BenchmarkVerdict.ts";
import { DOC_ASSETS } from "#layers/docs/shared/docLinks.ts";
import { stripLeadingEmoji } from "#layers/docs/shared/docPages.ts";

/** Ordered from most to least worth studying, which is also how the gallery sorts. */
export const BENCHMARK_VERDICTS = ["strong", "partial", "avoid"] as const;

/** Each entry opens with its label in bold, as `docs/benchmarks/TEMPLATE.md` lays it out. */
const BENCHMARK_VERDICT_LABELS = {
    strong: "Strong reference",
    partial: "Take one thing",
    avoid: "Avoid",
} as const satisfies Record<BenchmarkVerdict, string>;

export const BENCHMARKS_PATH = "/docs/benchmarks/";

const FURNITURE = new Set(["readme", "template"]);

export interface BenchmarkPage {
    path: string;
    title?: string;
    description?: string;
    url?: string;
    kind?: string;
    verdict?: string;
}

const isVerdict = (value: string | undefined): value is BenchmarkVerdict =>
    (BENCHMARK_VERDICTS as readonly string[]).includes(value ?? "");

/** The page's first paragraph minus the label it opens with, which the verdict pill already shows. */
const sentenceOf = (description: string, verdict: BenchmarkVerdict | null): string => {
    const label = verdict ? `${BENCHMARK_VERDICT_LABELS[verdict]}.` : null;

    return label && description.startsWith(label)
        ? description.slice(label.length).trim()
        : description;
};

/** One row per site; the folder's README and TEMPLATE are documentation about the library, not entries. */
export const toBenchmarks = (pages: BenchmarkPage[]): Benchmark[] =>
    pages
        .filter((page) => page.path.startsWith(BENCHMARKS_PATH))
        .map((page) => ({ page, id: page.path.slice(BENCHMARKS_PATH.length) }))
        .filter(({ id }) => !id.includes("/") && !FURNITURE.has(id))
        .map(({ page, id }) => {
            const verdict = isVerdict(page.verdict) ? page.verdict : null;

            return {
                path: page.path,
                id,
                title: stripLeadingEmoji(page.title ?? id),
                url: page.url ?? null,
                kind: page.kind ?? null,
                verdict,
                description: sentenceOf(page.description ?? "", verdict),
            };
        });

/** Where the build serves an entry's screenshot; `docs/benchmarks/README.md` names it after the file. */
export const screenshotOf = (benchmark: Benchmark): string =>
    `${DOC_ASSETS}${BENCHMARKS_PATH}images/${benchmark.id}.webp`;

interface BenchmarkFilter {
    verdict?: BenchmarkVerdict | "all";
    kind?: string;
    search?: string;
}

export const filterBenchmarks = (benchmarks: Benchmark[], filter: BenchmarkFilter): Benchmark[] => {
    const needle = filter.search?.trim().toLowerCase() ?? "";

    return benchmarks.filter((benchmark) => {
        if (filter.verdict && filter.verdict !== "all" && benchmark.verdict !== filter.verdict)
            return false;
        if (filter.kind && filter.kind !== "all" && benchmark.kind !== filter.kind) return false;
        if (needle.length === 0) return true;

        return `${benchmark.title} ${benchmark.url ?? ""} ${benchmark.description}`
            .toLowerCase()
            .includes(needle);
    });
};

/** A verdict that didn't parse sorts last rather than under a guessed value. */
const verdictRank = (verdict: BenchmarkVerdict | null): number =>
    verdict === null ? BENCHMARK_VERDICTS.length : BENCHMARK_VERDICTS.indexOf(verdict);

export const sortBenchmarks = (benchmarks: Benchmark[]): Benchmark[] =>
    benchmarks
        .slice()
        .sort(
            (a, b) =>
                verdictRank(a.verdict) - verdictRank(b.verdict) || a.title.localeCompare(b.title),
        );

/** Seeded from the vocabulary, so a verdict nothing carries yet still shows its zero. */
export const countByVerdict = (benchmarks: Benchmark[]): Record<BenchmarkVerdict, number> => {
    const counts = Object.fromEntries(BENCHMARK_VERDICTS.map((verdict) => [verdict, 0])) as Record<
        BenchmarkVerdict,
        number
    >;

    for (const benchmark of benchmarks) {
        if (benchmark.verdict !== null) counts[benchmark.verdict] += 1;
    }

    return counts;
};

/** Every kind some entry carries, for the filter, in a stable order. */
export const kindsOf = (benchmarks: Benchmark[]): string[] =>
    [...new Set(benchmarks.flatMap((benchmark) => (benchmark.kind ? [benchmark.kind] : [])))].sort(
        (a, b) => a.localeCompare(b),
    );
