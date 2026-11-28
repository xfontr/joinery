import type { Nuxt } from "@nuxt/schema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RequiredEnv } from "./requiredEnv";

const kit = vi.hoisted(() => ({ warn: vi.fn() }));

vi.mock("nuxt/kit", () => ({
    defineNuxtModule: (definition: unknown) => definition,
    useLogger: () => ({ warn: kit.warn }),
}));

const { setup } = (await import("./requiredEnv")).default as unknown as {
    setup: (options: RequiredEnv, nuxt: Nuxt) => void;
};

const required: RequiredEnv = {
    contact: ["NUXT_MAIL_API_KEY", "NUXT_MAIL_TO"],
    booking: ["NUXT_BOOKING_BASE_URL"],
};

const install = (options: Partial<Nuxt["options"]> = {}) =>
    setup(required, { options: { dev: false, ...options } } as unknown as Nuxt);

beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NUXT_MAIL_API_KEY", "key");
    vi.stubEnv("NUXT_MAIL_TO", "");
    vi.stubEnv("NUXT_BOOKING_BASE_URL", "");
    vi.stubEnv("NUXT_SITE_ENV", "");
});

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("requiredEnv module", () => {
    it("fails a production build naming every unset var, across features", () => {
        vi.stubEnv("NUXT_SITE_ENV", "production");

        expect(() => install()).toThrow(
            "Required env vars are unset: NUXT_MAIL_TO, NUXT_BOOKING_BASE_URL",
        );
    });

    it("lets a production build through once every var is set", () => {
        vi.stubEnv("NUXT_SITE_ENV", "production");
        vi.stubEnv("NUXT_MAIL_TO", "inbox");
        vi.stubEnv("NUXT_BOOKING_BASE_URL", "booking");

        expect(() => install()).not.toThrow();
    });

    it.each(["preview", ""])(
        "never fails a %j build, since CI and previews build without the secrets",
        (siteEnv) => {
            vi.stubEnv("NUXT_SITE_ENV", siteEnv);

            expect(() => install()).not.toThrow();
            expect(kit.warn).not.toHaveBeenCalled();
        },
    );

    it("warns the dev server about the unset vars instead of refusing to start", () => {
        install({ dev: true });

        expect(kit.warn).toHaveBeenCalledWith(
            "Required env vars are unset: NUXT_MAIL_TO, NUXT_BOOKING_BASE_URL",
        );
    });

    it.each([{ _prepare: true }, { test: true }])(
        "stays silent under %o, which never serve a request",
        (options) => {
            vi.stubEnv("NUXT_SITE_ENV", "production");

            expect(() => install({ dev: true, ...options })).not.toThrow();
            expect(kit.warn).not.toHaveBeenCalled();
        },
    );
});
