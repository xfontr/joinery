import type { Challenge } from "#layers/forms/app/types/Challenge";
import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { createError, readBody } from "h3";
import { describe, expect, it, vi } from "vitest";
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

const challenge = vi.fn((send: (token: string) => Promise<unknown>) => send("tok")) as Challenge;

const serveComments = (statusCode?: number) => {
    const received: unknown[] = [];

    serveEndpoint("/api/comments", async (event) => {
        received.push(await readBody(event));

        if (statusCode) throw createError({ statusCode });

        return {};
    });

    return received;
};

describe("usePostComment", () => {
    it("posts the fields and the honeypot with the challenge's token, then reports success", async () => {
        const received = serveComments();
        const { value: comment } = await withSetup(() => usePostComment());

        await comment.send(FIELDS, challenge);

        expect(received).toEqual([{ ...FIELDS, token: "tok" }]);
        expect(comment.status.value).toBe("success");
    });

    it.each([
        [409, "duplicate"],
        [410, "closed"],
        [429, "flood"],
        [403, "unavailable"],
        [502, "unavailable"],
    ] as const)("tells the reader why a %s failed: %s", async (statusCode, failure) => {
        serveComments(statusCode);
        const { value: comment } = await withSetup(() => usePostComment());

        await comment.send(FIELDS, challenge);

        expect(comment.status.value).toBe("error");
        expect(comment.failure.value).toBe(failure);
    });
});
