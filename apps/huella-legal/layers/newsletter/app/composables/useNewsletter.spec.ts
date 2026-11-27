import type { Challenge } from "#layers/forms/app/types/Challenge";
import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { readBody } from "h3";
import { describe, expect, it, vi } from "vitest";
import { useNewsletter } from "./useNewsletter";

const FIELDS = { email: "lucia@ejemplo.es", honeypot: "" };

const challenge = vi.fn((send: (token: string) => Promise<unknown>) => send("tok")) as Challenge;

describe("useNewsletter", () => {
    it("posts the address and the honeypot with the challenge's token, then reports success", async () => {
        const received: unknown[] = [];

        serveEndpoint("/api/newsletter", async (event) => {
            received.push(await readBody(event));

            return {};
        });
        const { value: newsletter } = await withSetup(() => useNewsletter());

        await newsletter.send(FIELDS, challenge);

        expect(received).toEqual([{ ...FIELDS, token: "tok" }]);
        expect(newsletter.status.value).toBe("success");
    });
});
