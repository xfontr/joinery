/** Every changelog, the one picked and the release metrics beside them; `ready` settles on load. */
export const useChangelogs = () => {
    const snapshot = useSnapshot("metrics");
    const list = useAsyncData(
        "changelogs",
        () =>
            queryCollection("docs")
                .where("path", "LIKE", "%/CHANGELOG")
                .select("path", "title")
                .all(),
        { default: () => [] },
    );
    const changelogs = list.data;

    const selected = ref<string | null>(null);
    watchEffect(() => {
        if (selected.value === null) selected.value = changelogs.value[0]?.path ?? null;
    });

    const content = useAsyncData(
        () => `changelog-${selected.value ?? "none"}`,
        () =>
            selected.value === null
                ? Promise.resolve(null)
                : queryCollection("docs").path(selected.value).first(),
        { watch: [selected] },
    );

    const metrics = computed(() => snapshot.data.value?.metrics ?? null);

    return {
        changelogs,
        selected,
        page: content.data,
        projects: computed(() => metrics.value?.projects ?? []),
        sinceRelease: computed(() => metrics.value?.commitsSinceLastRelease ?? null),
        conventional: computed(() => metrics.value?.conventionalCommitRate ?? null),
        ready: Promise.all([snapshot, list, content]),
    };
};
