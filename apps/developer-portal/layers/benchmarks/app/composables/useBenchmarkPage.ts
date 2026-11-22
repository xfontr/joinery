import type { BreadcrumbItem } from "@nuxt/ui";
import { BENCHMARKS_PATH } from "#layers/benchmarks/app/utils/benchmarks.ts";

/** One benchmark's rendered page and its gallery neighbours; `ready` settles once both load. */
export const useBenchmarkPage = () => {
    const route = useRoute();
    const id = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));
    const path = computed(() => `${BENCHMARKS_PATH}${id.value}`);

    const gallery = useBenchmarks();
    const benchmarks = gallery.data;
    const content = useAsyncData(
        () => `benchmark-${id.value}`,
        () => queryCollection("docs").path(path.value).first(),
        { watch: [path] },
    );

    const index = computed(() =>
        benchmarks.value.findIndex((candidate) => candidate.id === id.value),
    );
    const benchmark = computed(() => benchmarks.value[index.value] ?? null);

    const around = computed(() => {
        const { previous, next } = neighbours(benchmarks.value, index.value);
        const link = (entry: typeof previous) =>
            entry ? { to: `/benchmarks/${entry.id}`, title: entry.title } : null;
        return { previous: link(previous), next: link(next) };
    });

    const crumbs = computed<BreadcrumbItem[]>(() => [
        { label: "Benchmarks", to: "/benchmarks", icon: "i-lucide-bookmark" },
        { label: benchmark.value?.title ?? id.value },
    ]);

    return {
        id,
        page: content.data,
        benchmark,
        source: computed(() => `${path.value.slice(1)}.md`),
        crumbs,
        around,
        ready: Promise.all([gallery, content]),
    };
};
