import { serveEndpoint, slotStub } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { createError, readBody } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NewsletterForm from "./NewsletterForm.vue";

const MESSAGES = {
    newsletterForm: {
        email: {
            errors: {
                invalid: "invalid address",
                rejected: "rejected address",
                required: "required address",
            },
            label: "email",
            placeholder: "placeholder",
        },
        error: { description: "error description", title: "error title" },
        notice: "notice {privacy}",
        privacy: "privacy",
        submit: "submit",
        success: { description: "success description", title: "success title" },
    },
};

const challenge = vi.hoisted(() =>
    vi.fn((send: (token: string) => Promise<unknown>) => send("tok")),
);

const FormChallenge = slotStub({ challenge });

const serveNewsletter = (respond: () => unknown = () => ({})) => {
    const received: unknown[] = [];

    serveEndpoint("/api/newsletter", async (event) => {
        received.push(await readBody(event));

        return respond();
    });

    return received;
};

const rejectWith = (statusCode: number, data?: unknown) => () => {
    throw createError({ statusCode, data });
};

const mount = (props: Record<string, unknown> = {}) =>
    mountSuspended(NewsletterForm, { props, global: { stubs: { FormChallenge } } });

const submit = async (wrapper: Awaited<ReturnType<typeof mountSuspended>>, email: string) => {
    await wrapper.find("input[type=email]").setValue(email);
    await wrapper.find("form").trigger("submit");
    await flushPromises();
};

describe("newsletter form", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    beforeEach(() => {
        vi.unstubAllGlobals();
    });

    it("subscribes the trimmed address through the challenge, so a token rides with it", async () => {
        const received = serveNewsletter();
        const wrapper = await mount();

        await submit(wrapper, " lucia@ejemplo.es ");

        expect(received).toEqual([{ email: "lucia@ejemplo.es", honeypot: "", token: "tok" }]);
    });

    it("sends what a bot typed into the honeypot, which sits inside the form it guards", async () => {
        const received = serveNewsletter();
        const wrapper = await mount();

        await wrapper.find("form input[name=sitio]").setValue("https://spam.test");
        await submit(wrapper, "lucia@ejemplo.es");

        expect(received).toEqual([expect.objectContaining({ honeypot: "https://spam.test" })]);
    });

    it("withholds the request and shows the field error on an address with no domain", async () => {
        const received = serveNewsletter();
        const wrapper = await mount();

        await submit(wrapper, "lucia@");

        expect(received).toHaveLength(0);
        expect(wrapper.find("[data-slot=error]").text()).toBe("invalid address");
    });

    it.each([
        ["an empty", ""],
        ["a blank", "   "],
    ])(
        "shakes %s field instead of marking it, and tells only a screen reader why",
        async (_, email) => {
            const received = serveNewsletter();
            const wrapper = await mount();

            await submit(wrapper, email);

            expect(received).toHaveLength(0);
            expect(wrapper.find("[data-slot=error]").exists()).toBe(false);
            expect(wrapper.find("input[type=email]").attributes("aria-invalid")).not.toBe("true");
            expect(wrapper.find("[aria-live=polite]").text()).toBe("required address");
        },
    );

    it("stops checking as the reader types after a shake, even if an earlier attempt started it", async () => {
        const wrapper = await mount();

        await submit(wrapper, "lucia@");
        await submit(wrapper, "");
        vi.useFakeTimers();
        await wrapper.find("input[type=email]").setValue("l");
        await vi.runAllTimersAsync();
        vi.useRealTimers();
        await flushPromises();

        expect(wrapper.find("[data-slot=error]").exists()).toBe(false);
    });

    it("marks an empty field the usual way for a reader who asked for reduced motion", async () => {
        vi.stubGlobal("matchMedia", () => ({ matches: true }));
        const wrapper = await mount();

        await submit(wrapper, "");

        expect(wrapper.find("[data-slot=error]").text()).toBe("required address");
    });

    it.each([
        ["invalid", "invalid address"],
        ["rejected", "rejected address"],
    ])("words the server's %s code on the input, so it is read with it", async (code, message) => {
        serveNewsletter(rejectWith(422, [{ name: "email", message: code }]));
        const wrapper = await mount();

        await submit(wrapper, "lucia@ejemplo.es");

        const input = wrapper.find("input[type=email]");
        const error = wrapper.find("[data-slot=error]");

        expect(error.text()).toBe(message);
        expect(input.attributes("aria-invalid")).toBe("true");
        expect(input.attributes("aria-describedby")).toContain(error.attributes("id"));
    });

    it.each([
        ["stacked", true],
        ["inline", false],
    ] as const)("stretches the button only in the %s layout", async (layout, block) => {
        const wrapper = await mount({ layout });

        expect(wrapper.findComponent({ name: "UButton" }).props("block")).toBe(block);
    });
});
