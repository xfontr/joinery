import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { describe, expect, it, vi } from "vitest";
import type { AnalyticsEvent } from "~/types/AnalyticsEvent";

describe("useTrack", () => {
    it("raises the event as the hook the tracking layer listens to", async () => {
        const heard = vi.fn<(event: AnalyticsEvent) => void>();
        const unhook = useNuxtApp().hook("analytics:event", heard);

        await withSetup(() => useTrack()("share", { method: "print" }));
        unhook();

        expect(heard).toHaveBeenCalledWith({
            name: "share",
            params: { method: "print" },
        });
    });
});
