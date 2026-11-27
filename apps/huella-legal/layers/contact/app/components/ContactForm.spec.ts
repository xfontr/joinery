import { serveEndpoint, slotStub } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { createError, readBody } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm.vue";

const MESSAGES = {
    contactForm: {
        consent: { label: "consent label", name: "consent" },
        email: { label: "email label", name: "email", placeholder: "placeholder" },
        error: { description: "error description", title: "error title" },
        errors: { invalid: "invalid value", required: "required value" },
        message: { label: "message label", name: "message" },
        name: { label: "name label", name: "name" },
        notice: "notice {privacy}",
        privacy: "privacy",
        submit: "submit",
        success: { description: "success description", title: "success title" },
    },
    formErrorSummary: { item: "{field}: {message}", title: "one field | {count} fields" },
};

const FIELDS = {
    name: "Lucía Pérez",
    email: "lucia@ejemplo.es",
    message: "Una pregunta sobre un artículo.",
};

const challenge = vi.hoisted(() =>
    vi.fn((send: (token: string) => Promise<unknown>) => send("tok")),
);

const FormChallenge = slotStub({ challenge });

const serveContact = (respond: () => unknown = () => ({})) => {
    const received: unknown[] = [];

    serveEndpoint("/api/contact", async (event) => {
        received.push(await readBody(event));

        return respond();
    });

    return received;
};

const rejectWith = (statusCode: number, data?: unknown) => () => {
    throw createError({ statusCode, data });
};

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>;

const mount = () => mountSuspended(ContactForm, { global: { stubs: { FormChallenge } } });

const fill = async (wrapper: Wrapper, fields: Partial<typeof FIELDS>, consent = true) => {
    const { name = "", email = "", message = "" } = fields;

    await wrapper.find("input[autocomplete=name]").setValue(name);
    await wrapper.find("input[type=email]").setValue(email);
    await wrapper.find("textarea").setValue(message);
    if (consent) await wrapper.find("[role=checkbox]").trigger("click");
};

const submit = async (wrapper: Wrapper) => {
    await wrapper.find("form").trigger("submit");
    await flushPromises();
};

describe("contact form", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("sends the trimmed fields, the consent and the honeypot through the challenge", async () => {
        const received = serveContact();
        const wrapper = await mount();

        await fill(wrapper, { ...FIELDS, email: ` ${FIELDS.email} ` });
        await submit(wrapper);

        expect(received).toEqual([{ ...FIELDS, consent: true, honeypot: "", token: "tok" }]);
    });

    it("withholds the request without consent, and blames the checkbox", async () => {
        const received = serveContact();
        const wrapper = await mount();

        await fill(wrapper, FIELDS, false);
        await submit(wrapper);

        expect(received).toHaveLength(0);
        expect(wrapper.find("[role=alert]").text()).toContain("consent: required value");
    });

    it("lists every invalid field in a summary that links to it", async () => {
        const received = serveContact();
        const wrapper = await mount();

        await fill(wrapper, { name: "   ", email: "lucia@" });
        await submit(wrapper);

        const links = wrapper.findAll("[role=alert] a");
        const email = wrapper.find("input[type=email]");

        expect(received).toHaveLength(0);
        expect(links.map((link) => link.text())).toEqual(["name", "email", "message"]);
        expect(links[1]!.attributes("href")).toBe(`#${email.attributes("id")}`);
        expect(email.attributes("aria-invalid")).toBe("true");
    });

    it("marks the form busy and locks the fields while submitting, keeping what was typed", async () => {
        let release!: () => void;
        const pending = new Promise<void>((resolve) => {
            release = resolve;
        });

        serveContact(() => pending.then(() => ({})));
        const wrapper = await mount();

        await fill(wrapper, FIELDS);
        await submit(wrapper);

        const textarea = wrapper.find("textarea");

        expect(wrapper.find("form").attributes("aria-busy")).toBe("true");
        expect(textarea.attributes("disabled")).toBeDefined();
        expect((textarea.element as HTMLTextAreaElement).value).toBe(FIELDS.message);
        expect(wrapper.findComponent({ name: "UButton" }).props("loading")).toBe(true);
        release();
        await flushPromises();
    });

    it("words the server's codes on their fields and in the summary", async () => {
        serveContact(rejectWith(422, [{ name: "email", message: "invalid" }]));
        const wrapper = await mount();

        await fill(wrapper, FIELDS);
        await submit(wrapper);

        const input = wrapper.find("input[type=email]");
        const error = wrapper.find("[data-slot=error]");

        expect(error.text()).toBe("invalid value");
        expect(input.attributes("aria-describedby")).toContain(error.attributes("id"));
        expect(wrapper.find("[role=alert]").text()).toContain("email: invalid value");
    });

    it("announces a failed request and keeps the form for a retry", async () => {
        serveContact(rejectWith(500));
        const wrapper = await mount();

        await fill(wrapper, FIELDS);
        await submit(wrapper);

        expect(wrapper.find("[role=alert]").text()).toContain("error title");
        expect(wrapper.find("textarea").exists()).toBe(true);
    });

    it("replaces the form with the success panel, so nobody sends the message twice", async () => {
        serveContact();
        const wrapper = await mount();

        await fill(wrapper, FIELDS);
        await submit(wrapper);

        await vi.waitFor(() => expect(wrapper.find("form").exists()).toBe(false));
        expect(wrapper.find("h2").text()).toBe("success title");
    });
});
