import type { BreadcrumbItem } from "@nuxt/ui";
import { toCollectionPath } from "#layers/docs/shared/docPages.ts";
import { locate } from "#layers/wiki/app/utils/wiki.ts";

const slugOf = (param: string | string[] | undefined): string[] =>
    Array.isArray(param) ? param : [];

/** One rendered doc, where it sits in the tree and what the snapshot knows of it. */
export const useWikiPage = () => {
    const route = useRoute();
    const path = computed(() => `/${slugOf(route.params.slug).join("/")}`.toLowerCase());

    const wiki = useWiki();
    const sections = wiki.data;
    const content = useAsyncData(
        () => `doc-${path.value}`,
        () => queryCollection("docs").path(path.value).first(),
        { watch: [path] },
    );

    const here = computed(() => locate(sections.value, path.value));

    const crumbs = computed<BreadcrumbItem[]>(() => [
        { label: "Wiki", to: "/wiki", icon: "i-lucide-library" },
        ...(here.value
            ? [
                  { label: here.value.section.label, icon: here.value.section.icon },
                  { label: here.value.group.label, class: "font-mono" },
                  { label: here.value.entry.label },
              ]
            : []),
    ]);

    const around = computed(() => {
        const entries = here.value?.group.entries ?? [];
        const { previous, next } = neighbours(
            entries,
            entries.findIndex((entry) => entry.path === path.value),
        );
        const link = (entry: typeof previous) =>
            entry ? { to: `/wiki${entry.path}`, title: entry.label } : null;
        return { previous: link(previous), next: link(next) };
    });

    const meta = computed(
        () =>
            docsArtifact()?.pages.find((doc) => toCollectionPath(doc.path) === path.value) ?? null,
    );

    return {
        path,
        sections,
        page: content.data,
        here,
        crumbs,
        around,
        meta,
        source: computed(() => meta.value?.path ?? `${path.value.slice(1)}.md`),
        brokenLinks: computed(
            () => meta.value?.brokenLinks.map((link) => link.href).join(", ") ?? "",
        ),
        ready: Promise.all([wiki, content]),
    };
};
