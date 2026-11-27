import { beforeEach, describe, expect, it, vi } from "vitest";

const readLocale = vi.hoisted(() => vi.fn());

vi.mock("../utils/readLocale.ts", () => ({ default: readLocale }));

const { app } = await import("../app.ts");

const get = (path: string) => app.request(path);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("GET /:locale/:project failures", () => {
    it("500s a malformed locale file, rather than reporting it as a missing locale", async () => {
        readLocale.mockRejectedValue(new SyntaxError("Unexpected token }"));

        const res = await get("/en-GB/external");

        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toEqual({
            error: 'Locale "en-GB" in "external" could not be read',
        });
    });
});
