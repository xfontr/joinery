import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "./error.vue";

const nuxt = vi.hoisted(() => ({ useHead: vi.fn(), reloadNuxtApp: vi.fn() }));

mockNuxtImport("useHead", () => nuxt.useHead);
mockNuxtImport("reloadNuxtApp", () => nuxt.reloadNuxtApp);

const NOT_FOUND = {
    status: 404,
    message: "Page not found: /nowhere",
    stack: "Error\n    at render",
};
const SERVER = { status: 500, message: "Snapshot unreadable", stack: "Error\n    at read" };

const mountError = (error: Record<string, unknown>) =>
    mountSuspended(ErrorPage, { props: { error: error as never } });

beforeEach(() => {
    vi.clearAllMocks();
});

describe("error page", () => {
    it("links a 404 back to the overview", async () => {
        const wrapper = await mountError(NOT_FOUND);

        const links = wrapper
            .findAll("[data-error='not-found'] a")
            .map((a) => a.attributes("href"));

        expect(links).toEqual(["/"]);
    });

    it.each([500, 503])(
        "shows the server page for a %i, never the not-found one, keeping the real status",
        async (status) => {
            const wrapper = await mountError({ ...SERVER, status });

            expect(wrapper.find("[data-error='server']").exists()).toBe(true);
            expect(wrapper.find("[data-error='not-found']").exists()).toBe(false);
            expect(wrapper.find("[data-error='server'] h1").text()).toBe("error.server.title");
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
