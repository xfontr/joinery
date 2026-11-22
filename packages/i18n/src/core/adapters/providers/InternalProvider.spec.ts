import { describe, expect, it, vi } from "vitest";
import InternalProvider from "./InternalProvider";
import type { HttpClient } from "#core/ports/HttpClient";
import type { Vendor } from "#core/domain/vendor";

const messages = { shared: { health: "Health" } };

const vendor = { baseURL: "https://translations.test/", project: "external" } as Vendor;

describe("InternalProvider", () => {
    it("asks the translations server for the project's locale tree", async () => {
        const get = vi.fn().mockResolvedValue({ data: messages, headers: new Headers() });
        const http: HttpClient = { get };
        const provider = new InternalProvider(vendor, http);

        await expect(provider.getTranslations("en-GB")).resolves.toBe(messages);
        expect(get).toHaveBeenCalledWith("en-GB/external");
    });

    it("exposes empty options rather than none, for the vendor that has none", () => {
        expect(new InternalProvider(vendor, { get: vi.fn() }).options).toEqual({});
    });
});
