import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubNitro } from "@monorepo/configs/vitest/utils/nitro";
import { assertForm } from "../../../forms/server/utils/assertForm";

const nitro = vi.hoisted(() => ({
    body: vi.fn(),
    assertChallenge: vi.fn(),
    addSubscriber: vi.fn(),
}));

vi.mock("../adapters/kit", () => ({ addSubscriber: nitro.addSubscriber }));

// The `forms` layer's `assertForm` reaches this layer only as a Nitro auto-import
vi.stubGlobal("assertForm", assertForm);
vi.stubGlobal("assertChallenge", nitro.assertChallenge);
stubNitro();
vi.stubGlobal("readBody", nitro.body);

const handler = (await import("./newsletter.post")).default as unknown as (
    event: unknown,
) => Promise<void>;

beforeEach(() => {
    vi.clearAllMocks();
    nitro.body.mockResolvedValue({ email: " lucia@ejemplo.es ", honeypot: "", token: "tok" });
    nitro.assertChallenge.mockResolvedValue(undefined);
    nitro.addSubscriber.mockResolvedValue(undefined);
});

describe("POST /api/newsletter", () => {
    it("subscribes the trimmed address once the challenge passes", async () => {
        await handler({});

        expect(nitro.assertChallenge).toHaveBeenCalledWith({}, "tok");
        expect(nitro.addSubscriber).toHaveBeenCalledWith({}, "lucia@ejemplo.es");
    });

    // A bot told it failed would retry; one told it succeeded moves on
    it("answers a filled honeypot like a reader, spending no verification and subscribing nobody", async () => {
        nitro.body.mockResolvedValue({ email: "lucia@ejemplo.es", honeypot: "https://spam.test" });

        await expect(handler({})).resolves.toBeUndefined();
        expect(nitro.assertChallenge).not.toHaveBeenCalled();
        expect(nitro.addSubscriber).not.toHaveBeenCalled();
    });

    it.each([
        ["an address with no domain", "lucia@", "invalid"],
        ["a blank address", "   ", "required"],
        ["no address at all", undefined, "required"],
    ])("leaves %s as the bare issue code for the client to word", async (_, email, issue) => {
        nitro.body.mockResolvedValue({ email, honeypot: "", token: "tok" });

        await expect(handler({})).rejects.toMatchObject({
            statusCode: 422,
            data: [{ name: "email", message: issue }],
        });
        expect(nitro.addSubscriber).not.toHaveBeenCalled();
    });

    it("treats an empty body as a missing address, not a crash", async () => {
        nitro.body.mockResolvedValue(undefined);

        await expect(handler({})).rejects.toMatchObject({
            statusCode: 422,
            data: [{ name: "email" }],
        });
    });

    it("keeps the challenge's status, so a failed token is a 403 and nothing is sent", async () => {
        nitro.assertChallenge.mockRejectedValue(
            Object.assign(new Error("http"), { statusCode: 403 }),
        );

        await expect(handler({})).rejects.toMatchObject({ statusCode: 403 });
        expect(nitro.addSubscriber).not.toHaveBeenCalled();
    });
});
