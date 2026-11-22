import {
    BENCHMARKS_PATH,
    sortBenchmarks,
    toBenchmarks,
} from "#layers/benchmarks/app/utils/benchmarks.ts";

/** Read straight from the content collection: the frontmatter is the whole record, and nothing collects it. */
export const useBenchmarks = () =>
    useAsyncData(
        "benchmarks",
        async () =>
            sortBenchmarks(
                toBenchmarks(
                    await queryCollection("docs")
                        .where("path", "LIKE", `${BENCHMARKS_PATH}%`)
                        .select("path", "title", "description", "url", "kind", "verdict")
                        .all(),
                ),
            ),
        { default: () => [] },
    );
