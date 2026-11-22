import { describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";
import { useProjectReplay } from "./useProjectReplay.ts";

vi.mock("#layers/workflows/shared/workflows.ts", () => ({
    replayRange: (snapshot: { first: string; last: string } | null) => snapshot,
    projectView: vi.fn(),
}));

const synced = { snapshot: { first: "2026-11-17", last: "2026-11-22" } } as unknown as ProjectView;

describe("useProjectReplay", () => {
    it("lands on the last day when the snapshot arrives after setup", () => {
        const base = ref<ProjectView | undefined>(undefined);
        const replay = useProjectReplay(computed(() => base.value));

        base.value = synced;

        expect(replay.dayIndex.value).toBe(5);
        expect(replay.isLatest.value).toBe(true);
    });

    it("keeps an earlier day the reader picked and returns to the latest past the end", () => {
        const replay = useProjectReplay(computed(() => synced));

        replay.dayIndex.value = 2;
        expect(replay.dayIndex.value).toBe(2);

        replay.dayIndex.value = 5;
        expect(replay.isLatest.value).toBe(true);
    });
});
