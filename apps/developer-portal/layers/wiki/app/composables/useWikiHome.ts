/** The collected docs and the wiki tree the front page reads; `ready` settles once the tree loads. */
export const useWikiHome = () => {
    const wiki = useWiki();
    const sections = wiki.data;

    const entries = computed(() =>
        sections.value.flatMap((section) =>
            section.groups.flatMap((group) => group.entries.map((entry) => entry.path)),
        ),
    );

    return {
        sections,
        pages: docsArtifact()?.pages ?? [],
        count: computed(() => entries.value.length),
        known: computed(() => new Set(entries.value)),
        ready: wiki,
    };
};
