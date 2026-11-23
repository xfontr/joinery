import type { Challenge } from "#layers/forms/app/types/Challenge";
import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePostComment } from "./usePostComment";

const FIELDS = {
    post: "42",
    parent: "0",
    name: "Lucía Pérez",
    email: "lucia@ejemplo.es",
    content: "Muy buen artículo.",
    consent: true,
    honeypot: "",
};

const fetch = vi.hoisted(() => vi.fn());

// The i18n loader fetches the locale through the same import, so only the route is faked
mockNuxtImport(
    "$fetch",
    () => (url: string, options: unknown) =>
        url === "/api/comments" ? fetch(url, options) : globalThis.$fetch(url, options as never),
);

const challenge = vi.fn((send: (token: string) => Promise<unknown>) => send("tok")) as Challenge;

const rejected = (statusCode: number, data?: unknown) =>
    Object.assign(new Error("fetch failed"), {
        statusCode,
        data: { error: true, statusCode, statusMessage: "Refused", data },
    });

const setUp = async () => (await withSetup(() => usePostComment())).value;

beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue(undefined);
});

describe("usePostComment", () => {
    it("posts the fields and the honeypot with the challenge's token, then reports success", async () => {
        const comment = await setUp();

        await comment.send(FIELDS, challenge);

        expect(fetch).toHaveBeenCalledWith("/api/comments", {
            method: "POST",
            body: { ...FIELDS, token: "tok" },
        });
        expect(comment.status.value).toBe("success");
    });

    it.each([
        [409, "duplicate"],
        [410, "closed"],
        [429, "flood"],
        [403, "unavailable"],
        [502, "unavailable"],
    ] as const)("tells the reader why a %s failed: %s", async (statusCode, failure) => {
        const comment = await setUp();

        fetch.mockRejectedValue(rejected(statusCode));
        await comment.send(FIELDS, challenge);

        expect(comment.status.value).toBe("error");
        expect(comment.failure.value).toBe(failure);
    });
});
