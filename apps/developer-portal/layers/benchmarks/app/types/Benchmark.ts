import type { BenchmarkVerdict } from "./BenchmarkVerdict.ts";

export interface Benchmark {
    /** The collection path, `/docs/benchmarks/rauno-me`. */
    path: string;
    /** The filename without its extension — the segment the `/benchmarks/:id` route carries. */
    id: string;
    title: string;
    url: string | null;
    kind: string | null;
    /** Null when the frontmatter is missing one or names a value outside the vocabulary. */
    verdict: BenchmarkVerdict | null;
    /** The verdict sentence: `@nuxt/content`'s description, the page's first paragraph, minus its label. */
    description: string;
}
