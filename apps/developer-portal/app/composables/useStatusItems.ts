import type { ComputedRef } from "vue";
import type { StatusItem } from "~/types/StatusItem";

/** The status bar's figures, in the order `useShellFigures` lists the entries. */
export const useStatusItems = (
    figures: ComputedRef<Record<string, { status?: StatusItem }>>,
): ComputedRef<StatusItem[]> =>
    computed(() => Object.values(figures.value).flatMap(({ status }) => (status ? [status] : [])));
