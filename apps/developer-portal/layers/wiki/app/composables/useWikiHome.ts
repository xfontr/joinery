/** The collected docs and the wiki tree the front page reads; `ready` settles once both load. */
export const useWikiHome = () => {
    const snapshot = useSnapshot("docs");
    const wiki = useWiki();
    const sections = wiki.data;

    const entries = computed(() =>
        sections.value.flatMap((section) =>
            section.groups.flatMap((group) => group.entries.map((entry) => entry.path)),
        ),
    );

    return {
        sections,
        pages: computed(() => snapshot.data.value?.docs?.pages ?? []),
        count: computed(() => entries.value.length),
        known: computed(() => new Set(entries.value)),
        ready: Promise.all([snapshot, wiki]),
    };
};
