import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useReplyPace } from "./useReplyPace";

const setUp = async () => (await withSetup(() => useReplyPace())).value;

// useFetch keeps a payload it already holds under its key, which would outlive the test that read it
beforeEach(() => {
    clearNuxtData();
});

describe("useReplyPace", () => {
    it("reports no slow date until the route has answered, rather than flashing a warning", async () => {
        serveEndpoint("/api/replies", () => ({ slowUntil: "2026-08-31" }));

        expect((await setUp()).value).toBeUndefined();
    });

    it("hands on the last slow day the route names", async () => {
        serveEndpoint("/api/replies", () => ({ slowUntil: "2026-08-31" }));

        const pace = await setUp();

        await vi.waitFor(() => expect(pace.value).toBe("2026-08-31"));
    });
});
