import type { AppEntry } from "~/types/AppEntry";
import type { AppGroup } from "~/types/AppGroup";
import type { MenuRow } from "~/types/MenuRow";
import { matchPages, searchGroups } from "~/utils/search";

/** ⌘K search over the pages, the projects and the docs; the docs load on first open. */
export const useShellSearch = (
    apps: (AppGroup & { entries: AppEntry[] })[],
    projects: Ref<MenuRow[]> | undefined,
) => {
    const open = ref(false);

    // Deferred to the first open; built here it rides in every prerendered payload (../../README.md).
    const {
        data: sections,
        status,
        execute,
    } = useAsyncData("search-sections", () => queryCollectionSearchSections("docs"), {
        default: () => [],
        immediate: false,
        server: false,
    });

    watch(open, () => {
        if (open.value && status.value === "idle") void execute();
    });

    const projectGroup = computed(() => ({
        id: "projects",
        label: "Projects",
        ignoreFilter: true,
        postFilter: matchPages,
        items: (projects?.value ?? []).flatMap((kind) =>
            (kind.children ?? []).map((row) => ({
                label: row.label,
                suffix: kind.label,
                to: row.to,
                icon: "i-lucide-box",
            })),
        ),
    }));

    const groups = computed(() => {
        const [pages, ...docs] = searchGroups(apps, sections.value);
        return [...(pages ? [pages] : []), projectGroup.value, ...docs];
    });

    return { open, groups, loading: computed(() => status.value === "pending") };
};
