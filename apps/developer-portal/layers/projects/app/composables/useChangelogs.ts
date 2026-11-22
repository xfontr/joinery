/** Every changelog, the one picked and the release metrics beside them; `ready` settles on load. */
export const useChangelogs = () => {
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

    const metrics = metricsArtifact();

    return {
        changelogs,
        selected,
        page: content.data,
        projects: metrics?.projects ?? [],
        sinceRelease: metrics?.commitsSinceLastRelease ?? null,
        conventional: metrics?.conventionalCommitRate ?? null,
        ready: Promise.all([list, content]),
    };
};
