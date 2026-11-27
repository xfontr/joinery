import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "./error.vue";

const nuxt = vi.hoisted(() => ({ useHead: vi.fn(), reloadNuxtApp: vi.fn() }));

mockNuxtImport("useHead", () => nuxt.useHead);
mockNuxtImport("reloadNuxtApp", () => nuxt.reloadNuxtApp);

const global = {
    stubs: { NuxtLayout: { template: "<div data-shell='layout'><slot /></div>" } },
};

const NOT_FOUND = {
    status: 404,
    message: "Page not found: /nowhere",
    stack: "Error\n    at render",
};
const SERVER = { status: 500, message: "ImageKit unreachable", stack: "Error\n    at fetch" };

const mountError = (error: Record<string, unknown>) =>
    mountSuspended(ErrorPage, { props: { error: error as never }, global });

beforeEach(() => {
    vi.clearAllMocks();
});

describe("error page", () => {
    it("renders inside the layout, so a reader who lands on it keeps the site's frame", async () => {
        const wrapper = await mountError(NOT_FOUND);

        expect(wrapper.find("[data-shell='layout'] [data-error] h1").exists()).toBe(true);
    });

    it("links a 404 home and offers no retry, since reloading a missing page finds nothing", async () => {
        const wrapper = await mountError(NOT_FOUND);

        const page = wrapper.find("[data-error='not-found']");

        expect(page.findAll("a").map((a) => a.attributes("href"))).toEqual(["/"]);
        expect(page.find("button").exists()).toBe(false);
    });

    it.each([500, 503])(
        "shows the server page for a %i, never the not-found copy, keeping the real status",
        async (status) => {
            const wrapper = await mountError({ ...SERVER, status });

            expect(wrapper.find("[data-error='not-found']").exists()).toBe(false);
            expect(wrapper.find("[data-error='server'] h1").text()).toBe(String(status));
            expect(wrapper.text()).not.toContain("The frame is empty");
        },
    );

    it("retries every time it is clicked, not once per ten seconds as a bare reloadNuxtApp would", async () => {
        const wrapper = await mountError(SERVER);

        await wrapper.find("[data-error='server'] button").trigger("click");

        expect(nuxt.reloadNuxtApp).toHaveBeenCalledExactlyOnceWith({ force: true });
    });

    it("keeps error pages out of search results and outranks the page title", async () => {
        await mountError(NOT_FOUND);

        const [input, options] = nuxt.useHead.mock.calls[0] as [{ meta: object[] }, object];

        expect(input.meta).toContainEqual({ name: "robots", content: "noindex" });
        expect(options).toEqual({ tagPriority: "high" });
    });

    it.each([NOT_FOUND, SERVER])(
        "never shows a reader the message or the stack ($status)",
        async (error) => {
            const wrapper = await mountError(error);

            expect(wrapper.text()).not.toContain(error.message);
            expect(wrapper.text()).not.toContain("at ");
        },
    );
});
