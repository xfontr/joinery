import { describe, expect, it } from "vitest";
import { createT, rawKeysIn } from "./i18n.ts";

const MESSAGES = {
    form: {
        submit: "Enviar",
        notice: "Lee {privacy}",
        fields: "un campo | {count} campos",
    },
    title: "Revista",
};

describe("createT", () => {
    it("words a key the way the app does, interpolation and plurals included", () => {
        const t = createT(MESSAGES);

        expect(t("form.submit")).toBe("Enviar");
        expect(t("form.notice", { privacy: "la política" })).toBe("Lee la política");
        expect(t("form.fields", { count: 3 }, 3)).toBe("3 campos");
    });

    it("throws on a key the messages lack, rather than naming a control by its key", () => {
        const t = createT(MESSAGES);

        expect(() => t("form.cancel")).toThrow('No message for "form.cancel"');
    });
});

describe("rawKeysIn", () => {
    it("finds a key printed in place of its message", () => {
        expect(rawKeysIn("Revista Lee form.notice ahora", MESSAGES)).toEqual(["form.notice"]);
    });

    it("finds a key the messages lack, as a key built from a variable prints it", () => {
        expect(rawKeysIn("Revista form.errors.undefined ahora", MESSAGES)).toEqual([
            "form.errors.undefined",
        ]);
    });

    it("finds nothing in text that only uses the messages", () => {
        expect(rawKeysIn("Revista Enviar Lee la política", MESSAGES)).toEqual([]);
    });

    it("leaves a host or an address alone, even one whose first label is a namespace", () => {
        expect(
            rawKeysIn("Escribe a hola@form.es o visita www.form.es y title.es", MESSAGES),
        ).toEqual([]);
    });
});
