import { createError } from "h3";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stubNitro } from "./nitro.ts";

const nitro = globalThis as unknown as {
    defineEventHandler: <T>(handler: T) => T;
    createError: typeof createError;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("stubNitro", () => {
    it("hands a route its own handler back, so the spec calls it directly", () => {
        stubNitro();
        const handler = () => "ok";

        expect(nitro.defineEventHandler(handler)).toBe(handler);
    });

    it("throws h3's own errors, so a route's status and data match what Nitro sends", () => {
        stubNitro();

        expect(nitro.createError).toBe(createError);
    });
});
