import type { SiteData } from "~/types/SiteData";

const EMPTY: SiteData = {
    benchmarks: [],
    decisions: [],
    workflows: { projects: [], templates: [], lessons: 0 },
    rules: null,
    specs: null,
};

/**
 * One cut of the portal's payload under its own key, so a page's payload carries only that cut.
 * With `dataUrl` unset every cut is empty; set, a failed fetch fails the page and so the build.
 */
const useSiteData = async <T>(key: string, pick: (data: SiteData) => T) => {
    const { dataUrl } = useRuntimeConfig().public;
    const result = await useAsyncData(
        `site-${key}`,
        async () => pick(dataUrl ? await $fetch<SiteData>(dataUrl) : EMPTY),
        { default: () => pick(EMPTY) },
    );

    if (result.error.value) {
        throw createError({ status: 502, message: `${dataUrl}: ${result.error.value.message}` });
    }

    return result;
};

export const useBenchmarks = () => {
    // Read before the fetch: `useAppConfig()` inside the handler runs after an await, without Nuxt
    const portal = useAppConfig().portalUrl;

    return useSiteData("benchmarks", ({ benchmarks }) =>
        benchmarks.map((item) => ({ ...item, screenshot: `${portal}${item.screenshot}` })),
    );
};

export const useDecisionReports = () => useSiteData("decisions", ({ decisions }) => decisions);

export const useWorkflowMaps = () =>
    useSiteData("workflow-maps", ({ workflows }) =>
        workflows.projects.map(({ id, title, map }) => ({ id, title, map })),
    );

export const useWorkflowGlyph = (id: string) =>
    useSiteData(
        `workflow-glyph-${id}`,
        ({ workflows }) => workflows.projects.find((project) => project.id === id)?.glyph ?? null,
    );

export const useWorkflowTemplates = () =>
    useSiteData("workflow-templates", ({ workflows }) => ({
        templates: workflows.templates,
        lessons: workflows.lessons,
    }));

export const useRuleCounts = () => useSiteData("rule-counts", ({ rules }) => rules);

export const useSpecTotal = () => useSiteData("spec-total", ({ specs }) => specs);
