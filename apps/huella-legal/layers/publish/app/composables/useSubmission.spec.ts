import type { Challenge } from "#layers/forms/app/types/Challenge";
import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { readMultipartFormData } from "h3";
import { describe, expect, it, vi } from "vitest";
import { useSubmission } from "./useSubmission";

const FIELDS = {
    name: "Lucía Pérez",
    email: "lucia@ejemplo.es",
    kind: "tfg",
    title: "",
    summary: "La admisibilidad de los mensajes de WhatsApp como prueba.",
    file: new File(["PK"], "borrador.docx"),
    consent: true,
    honeypot: "",
} as const;

const challenge = vi.fn((send: (token: string) => Promise<unknown>) => send("tok")) as Challenge;

describe("useSubmission", () => {
    it("posts the proposal and its file as multipart with the challenge's token, then reports success", async () => {
        let parts: Awaited<ReturnType<typeof readMultipartFormData>>;

        serveEndpoint("/api/submissions", async (event) => {
            parts = await readMultipartFormData(event);

            return {};
        });
        const { value: submission } = await withSetup(() => useSubmission());

        await submission.send(FIELDS, challenge);

        const text = (name: string) => parts?.find((part) => part.name === name)?.data.toString();
        const file = parts?.find((part) => part.name === "file");

        expect(text("summary")).toBe(FIELDS.summary);
        expect(file?.filename).toBe("borrador.docx");
        expect(text("token")).toBe("tok");
        expect(submission.status.value).toBe("success");
    });
});
