import { buildWiki } from "#layers/wiki/app/utils/wiki.ts";

/** Built once per session under one key — every doc page renders the same nav, and re-deriving it per navigation would rebuild the tree on each click. */
export const useWiki = () => {
    const { t } = useI18n();

    return useAsyncData(
        "wiki",
        async () => buildWiki(await queryCollection("docs").select("path", "title").all(), t),
        { default: () => [] },
    );
};
