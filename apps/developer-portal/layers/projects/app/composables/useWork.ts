import type { Work } from "#layers/projects/app/types/Work.ts";
import { toWork, WORK_FIELDS, WORK_PATH } from "#layers/projects/app/utils/work.ts";

/** Read straight from the `work` collection, in the order the files give. */
export const useWorkList = () =>
    useAsyncData(
        "work",
        async () =>
            (
                await queryCollection("work")
                    .select(...WORK_FIELDS)
                    .order("order", "ASC")
                    .all()
            ).map(toWork),
        { default: (): Work[] => [] },
    );

export const useWorkEntry = (slug: MaybeRefOrGetter<string>) =>
    useAsyncData(
        () => `work-${toValue(slug)}`,
        () =>
            queryCollection("work")
                .path(`${WORK_PATH}${toValue(slug)}`)
                .first(),
        { watch: [() => toValue(slug)] },
    );
