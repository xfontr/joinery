import type { ComputedRef } from "vue";
import { projectView, replayRange, type ProjectView } from "#layers/workflows/shared/workflows.ts";

const DAY_MS = 86_400_000;

/** Lays the synced project over any day its snapshot covers, the latest by default. */
export const useProjectReplay = (base: ComputedRef<ProjectView | undefined>) => {
    const range = computed(() => replayRange(base.value?.snapshot ?? null));
    const days = computed(() => {
        if (!range.value) return [];

        const first = Date.parse(`${range.value.first}T00:00:00Z`);
        const last = Date.parse(`${range.value.last}T00:00:00Z`);

        return Array.from({ length: Math.round((last - first) / DAY_MS) + 1 }, (_, index) =>
            new Date(first + index * DAY_MS).toISOString().slice(0, 10),
        );
    });
    const picked = ref<number | null>(null);
    // Derived on read: the snapshot arrives after setup, so a clamp taken then would stick at -1.
    const dayIndex = computed({
        get: () => Math.min(picked.value ?? Number.MAX_SAFE_INTEGER, days.value.length - 1),
        set: (index: number) => (picked.value = index >= days.value.length - 1 ? null : index),
    });
    const isLatest = computed(() => dayIndex.value >= days.value.length - 1);
    const dayLabel = computed(() => {
        const day = days.value[dayIndex.value];
        if (!day) return "";

        return isLatest.value ? `${calendarDay(day)} · today` : calendarDay(day);
    });

    const view = computed(() => {
        const synced = base.value;
        const day = days.value[dayIndex.value];
        if (!synced || isLatest.value || !day) return synced;

        return projectView(synced.project, synced.template, synced.snapshot, day);
    });

    return { range, days, dayIndex, isLatest, dayLabel, view };
};
