import { describe, expect, it } from "vitest";
import { computed, ref } from "vue";
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";
import { useProjectReplay } from "./useProjectReplay.ts";

const synced = {
    snapshot: {
        syncedAt: "2026-11-22T09:00:00Z",
        milestone: "Blog",
        issues: [{ activity: ["2026-11-17"] }],
        noMilestone: [],
    },
} as unknown as ProjectView;

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
