import type { BreadcrumbItem } from "@nuxt/ui";
import { sortDecisions } from "#layers/decisions/shared/decisionReports.ts";

/** One decision's rendered report and the ones decided either side of it; `ready` settles on load. */
export const useDecisionPage = () => {
    const route = useRoute();
    const id = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));
    const path = computed(() => `/docs/decisions/${id.value}`);

    const reports = useDecisionReports();
    const content = useAsyncData(
        () => `decision-${id.value}`,
        () => queryCollection("docs").path(path.value).first(),
        { watch: [path] },
    );

    const report = computed(
        () => reports.value.find((candidate) => candidate.id === id.value) ?? null,
    );

    const around = computed(() => {
        const ordered = sortDecisions(reports.value, "oldest");
        const { previous, next } = neighbours(
            ordered,
            ordered.findIndex((candidate) => candidate.id === id.value),
        );
        const link = (entry: typeof previous) =>
            entry ? { to: `/decisions/${entry.id}`, title: entry.title } : null;
        return { previous: link(previous), next: link(next) };
    });

    const crumbs = computed<BreadcrumbItem[]>(() => [
        { label: "Decisions", to: "/decisions", icon: "i-lucide-compass" },
        { label: report.value?.number ?? id.value, class: "font-mono" },
    ]);

    return {
        id,
        page: content.data,
        report,
        source: computed(() => report.value?.path ?? `${path.value.slice(1)}.md`),
        crumbs,
        around,
        ready: content,
    };
};
