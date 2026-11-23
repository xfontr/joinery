import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePage } from "./usePage";

const PAGE: Page = {
    id: "1",
    slug: "aviso-legal",
    title: "Aviso legal",
    body: { lead: "<p>Uno</p>", html: "", toc: [], notes: [], bibliography: [] },
    permalink: "https://revista.test/aviso-legal/",
};

const nuxt = vi.hoisted(() => ({
    seo: {} as Record<string, unknown>,
    signedTitle: undefined as unknown as () => string | undefined,
}));

mockNuxtImport("useSeoMeta", () => (input: Record<string, unknown>) => {
    nuxt.seo = input;
});

mockNuxtImport("useSeoTitleTemplate", () => (seoTitle: () => string | undefined) => {
    nuxt.signedTitle = seoTitle;
});

const setUp = (route = "/aviso-legal/") =>
    withSetup(() => usePage(), { route }).then(
        () => ({ failure: undefined }),
        (failure: unknown) => ({ failure }),
    );

const seo = (field: string) => (nuxt.seo[field] as () => unknown)();

const serve = (answer: () => unknown, slug = "aviso-legal") => {
    serveEndpoint(`/api/pages/${slug}`, answer);
};

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    nuxt.seo = {};
    clearNuxtData();
});

describe("usePage", () => {
    it("reads the page named by the route", async () => {
        serve(() => PAGE);

        expect((await setUp()).failure).toBeUndefined();
        expect(seo("title")).toBe("Aviso legal");
    });

    it("throws a fatal 404 when WordPress has no page by the slug", async () => {
        serve(() => new Response("Not found", { status: 404 }));

        expect((await setUp()).failure).toMatchObject({ status: 404, fatal: true });
    });

    it("prefers the CMS's SEO title and description over the page's own", async () => {
        serve(() => ({ ...PAGE, seo: { title: "Aviso | Huella", description: "Resumen" } }));

        await setUp();

        expect([seo("title"), seo("description")]).toEqual(["Aviso | Huella", "Resumen"]);
    });

    it("tells the title template which title the CMS wrote", async () => {
        serve(() => ({ ...PAGE, seo: { title: "Aviso | Huella" } }));

        await setUp();

        expect(nuxt.signedTitle()).toBe("Aviso | Huella");
    });

    it("falls back to the page's title and indexes the page", async () => {
        serve(() => PAGE);
        await setUp();

        expect([seo("title"), seo("robots")]).toEqual(["Aviso legal", undefined]);
    });

    it("keeps a page the CMS marks noindex out of the index", async () => {
        serve(() => ({ ...PAGE, seo: { noindex: true } }));
        await setUp();

        expect(seo("robots")).toBe("noindex");
    });
});
