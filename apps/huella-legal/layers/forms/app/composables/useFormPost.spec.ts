import type { Challenge } from "../types/Challenge";
import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import type { FormError } from "@nuxt/ui";
import { createError, readBody, readMultipartFormData } from "h3";
import { describe, expect, it, vi } from "vitest";
import { useFormPost } from "./useFormPost";

type Failure = "duplicate" | "unavailable";

interface Request extends FormRequest {
    email: string;
}

const ENDPOINT = "/api/form";

const FIELDS = { email: "lucia@ejemplo.es", honeypot: "" };

const FAILURES = { 409: "duplicate" } as const satisfies Partial<Record<number, Failure>>;

const challenge = vi.fn((send: (token: string) => Promise<unknown>) => send("tok")) as Challenge;

const serve = (respond: (call: number) => unknown = () => ({})) => {
    const received: unknown[] = [];

    serveEndpoint(ENDPOINT, async (event) => {
        received.push(await readBody(event));

        return respond(received.length);
    });

    return received;
};

const rejectWith = (statusCode: number, data?: unknown) => () => {
    throw createError({ statusCode, data });
};

const setUp = async (multipart = false) =>
    (
        await withSetup(() =>
            useFormPost<Request, FormError, Failure>(ENDPOINT, {
                failures: FAILURES,
                multipart,
            }),
        )
    ).value;

describe("useFormPost", () => {
    it("posts the fields and the honeypot with the challenge's token, then reports success", async () => {
        const received = serve();
        const post = await setUp();

        await post.send(FIELDS, challenge);

        expect(received).toEqual([{ ...FIELDS, token: "tok" }]);
        expect(post.status.value).toBe("success");
    });

    it("posts multipart fields as FormData, keeping a file as a file and dropping an empty one", async () => {
        let parts: Awaited<ReturnType<typeof readMultipartFormData>>;

        serveEndpoint(ENDPOINT, async (event) => {
            parts = await readMultipartFormData(event);

            return {};
        });
        const post = await setUp(true);
        const file = new File(["PK"], "borrador.docx");

        await post.send({ ...FIELDS, consent: true, file, none: null } as never, challenge);

        const texts = Object.fromEntries(
            (parts ?? [])
                .filter((part) => !part.filename)
                .map((part) => [part.name, part.data.toString()]),
        );
        const sent = parts?.find((part) => part.name === "file");

        expect(texts).toEqual({ ...FIELDS, consent: "true", token: "tok" });
        expect(sent?.filename).toBe("borrador.docx");
        expect(sent?.data.toString()).toBe("PK");
    });

    it("is submitting while the request is in flight, and ignores a second submit", async () => {
        let settle: () => void = () => undefined;
        const received = serve(
            () => new Promise<object>((resolve) => (settle = () => resolve({}))),
        );
        const post = await setUp();

        const first = post.send(FIELDS, challenge);

        await vi.waitFor(() => expect(post.status.value).toBe("submitting"));
        await post.send(FIELDS, challenge);
        await vi.waitFor(() => expect(received).toHaveLength(1));
        settle();
        await first;

        expect(received).toHaveLength(1);
        expect(post.status.value).toBe("success");
    });

    it("turns a 422 into invalid, keeping the server's issue codes with no failure to announce", async () => {
        const issues = [{ name: "email", message: "invalid" }];

        serve(rejectWith(422, issues));
        const post = await setUp();

        await post.send(FIELDS, challenge);

        expect(post.status.value).toBe("invalid");
        expect(post.errors.value).toEqual(issues);
        expect(post.failure.value).toBeUndefined();
    });

    it.each([
        [409, "duplicate"],
        [403, "unavailable"],
        [502, "unavailable"],
        [422, "unavailable"],
    ] as const)("turns a %s with no field blamed into error: %s", async (statusCode, failure) => {
        serve(rejectWith(statusCode));
        const post = await setUp();

        await post.send(FIELDS, challenge);

        expect(post.status.value).toBe("error");
        expect(post.errors.value).toEqual([]);
        expect(post.failure.value).toBe(failure);
    });

    it("turns a challenge that never yields a token into error without posting", async () => {
        const received = serve();
        const post = await setUp();

        await post.send(FIELDS, () => Promise.reject(new Error("Timeout")));

        expect(received).toHaveLength(0);
        expect(post.status.value).toBe("error");
    });

    it("clears the last attempt's errors and failure on a retry", async () => {
        serve((call) => {
            if (call === 1)
                throw createError({
                    statusCode: 422,
                    data: [{ name: "email", message: "invalid" }],
                });
            if (call === 2) throw createError({ statusCode: 409 });

            return {};
        });
        const post = await setUp();

        await post.send(FIELDS, challenge);
        await post.send(FIELDS, challenge);
        await post.send(FIELDS, challenge);

        expect(post.status.value).toBe("success");
        expect(post.errors.value).toEqual([]);
        expect(post.failure.value).toBeUndefined();
    });
});
