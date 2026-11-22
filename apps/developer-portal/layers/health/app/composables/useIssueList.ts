import { filterIssues, sortIssues } from "#layers/github/app/utils/issues.ts";

/** The live issue read, filtered and newest first, with a manual re-read. */
export const useIssueList = () => {
    // Not awaited: `await` resolves to the plain `useFetch` state and would drop `reload` with it.
    const { data: issues, reload } = useIssues();

    const label = ref("all");
    const search = ref("");

    const all = computed(() => issues.value.issues);
    const visible = computed(() =>
        sortIssues(filterIssues(all.value, { label: label.value, search: search.value })),
    );

    const reloading = ref(false);
    const refresh = async (): Promise<void> => {
        reloading.value = true;
        await reload();
        reloading.value = false;
    };

    return { issues, label, search, all, visible, reloading, refresh };
};
