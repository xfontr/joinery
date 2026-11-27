import { serveEndpoint, slotStub } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readMultipartFormData } from "h3";
import { MANUSCRIPT_MAX_BYTES } from "../../shared/schemas/submission";
import PublishForm from "./PublishForm.vue";

const MESSAGES = {
    publishForm: {
        consent: { label: "consent label", name: "consent" },
        email: { label: "email label", name: "email", placeholder: "placeholder" },
        error: { description: "error description", title: "error title" },
        errors: {
            fileSize: "too large",
            fileType: "wrong type",
            invalid: "invalid value",
            required: "required value",
        },
        file: {
            description: "file description",
            help: "file help",
            label: "file label",
            name: "file",
            upload: "upload",
        },
        kind: {
            items: { article: "Artículo", tfg: "TFG", tfm: "TFM" },
            label: "kind label",
            name: "kind",
        },
        name: { label: "name label", name: "name" },
        notice: "notice {privacy}",
        privacy: "privacy",
        submit: "submit",
        success: { description: "success description", title: "success title" },
        summary: { help: "summary help", label: "summary label", name: "summary" },
        title: { label: "title label", name: "title" },
    },
    formErrorSummary: { item: "{field}: {message}", title: "one field | {count} fields" },
};

const FIELDS = {
    name: "Lucía Pérez",
    email: "lucia@ejemplo.es",
    summary: "La admisibilidad de los mensajes de WhatsApp como prueba.",
};

const challenge = vi.hoisted(() =>
    vi.fn((send: (token: string) => Promise<unknown>) => send("tok")),
);

const FormChallenge = slotStub({ challenge });

type Parts = Awaited<ReturnType<typeof readMultipartFormData>>;

const serveSubmissions = (respond: () => unknown = () => ({})) => {
    const received: Parts[] = [];

    serveEndpoint("/api/submissions", async (event) => {
        received.push(await readMultipartFormData(event));

        return respond();
    });

    return received;
};

const text = (parts: Parts, name: string) =>
    parts?.find((part) => part.name === name)?.data.toString();

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>;

const mounted: Wrapper[] = [];

const mount = async () => {
    const wrapper = await mountSuspended(PublishForm, { global: { stubs: { FormChallenge } } });

    mounted.push(wrapper);

    return wrapper;
};

const fill = async (wrapper: Wrapper, fields: Partial<typeof FIELDS>, consent = true) => {
    const { name = "", email = "", summary = "" } = fields;

    await wrapper.find("input[autocomplete=name]").setValue(name);
    await wrapper.find("input[type=email]").setValue(email);
    await wrapper.find("textarea").setValue(summary);
    if (consent) await wrapper.find("[role=checkbox]").trigger("click");
};

const attach = async (wrapper: Wrapper, file: File) => {
    const input = wrapper.find("input[type=file]");

    Object.defineProperty(input.element, "files", { value: [file], configurable: true });
    await input.trigger("change");
};

const submit = async (wrapper: Wrapper) => {
    await wrapper.find("form").trigger("submit");
    await flushPromises();
};

describe("publish form", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    beforeEach(() => {
        // UFileUpload previews through Node's URL, which refuses the test DOM's File
        vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:borrador");
    });

    afterEach(() => {
        mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    });

    it("sends a proposal with no file, defaulting the kind to an article", async () => {
        const received = serveSubmissions();
        const wrapper = await mount();

        await fill(wrapper, { ...FIELDS, email: ` ${FIELDS.email} ` });
        await submit(wrapper);

        const [parts] = received;

        expect(received).toHaveLength(1);
        expect(parts?.map((part) => part.name)).not.toContain("file");
        expect(text(parts, "name")).toBe(FIELDS.name);
        expect(text(parts, "email")).toBe(FIELDS.email);
        expect(text(parts, "summary")).toBe(FIELDS.summary);
        expect(text(parts, "kind")).toBe("article");
        expect(text(parts, "consent")).toBe("true");
        expect(text(parts, "token")).toBe("tok");
    });

    it("sends the attached File itself, not the reactive proxy FormData would refuse", async () => {
        const received = serveSubmissions();
        const wrapper = await mount();

        await fill(wrapper, FIELDS);
        await attach(wrapper, new File(["PK"], "borrador.docx"));
        await submit(wrapper);

        const file = received[0]?.find((part) => part.name === "file");

        expect(file?.filename).toBe("borrador.docx");
        expect(file?.data.toString()).toBe("PK");
    });

    it("refuses a file over the cap on the file field, without sending", async () => {
        const received = serveSubmissions();
        const wrapper = await mount();
        const file = new File(["x"], "borrador.pdf");

        Object.defineProperty(file, "size", { value: MANUSCRIPT_MAX_BYTES + 1 });
        await fill(wrapper, FIELDS);
        await attach(wrapper, file);
        await submit(wrapper);

        expect(received).toHaveLength(0);
        expect(wrapper.find("[role=alert]").text()).toContain("file: too large");
    });
});
