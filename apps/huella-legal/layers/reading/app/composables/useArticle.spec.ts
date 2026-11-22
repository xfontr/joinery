import { withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { fakeAsset, fakeAuthor } from "@monorepo/content/testing";
import { mockNuxtImport, registerEndpoint } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useArticle } from "./useArticle";

const ARTICLE: Article = {
    id: "1",
    slug: "la-culpa",
    title: "La culpa",
    excerpt: "El deber de cuidado.",
    publishedAt: "2024-03-12T09:00:00Z",
    image: fakeAsset(),
    authors: [fakeAuthor()],
    category: { id: "2", slug: "derecho-penal", name: "Derecho penal" },
    tags: [
        { id: "3", slug: "dolo", name: "Dolo" },
        { id: "4", slug: "imprudencia", name: "Imprudencia" },
    ],
    format: "comentario",
    readingMinutes: 12,
    body: { lead: "", html: "", toc: [], notes: [], bibliography: [] },
    permalink: "https://revista.test/la-culpa/",
    citations: [],
};

const nuxt = vi.hoisted(() => ({
    fetches: new Map<string, Record<string, unknown> | undefined>(),
    seo: {} as Record<string, unknown>,
    signedTitle: undefined as unknown as () => string | undefined,
}));

mockNuxtImport("useCachedFetch", (original) => (...args: Parameters<typeof original>) => {
    nuxt.fetches.set(args[0] as string, args[1] as Record<string, unknown> | undefined);
    return original(...args);
});

mockNuxtImport("useSeoMeta", () => (input: Record<string, unknown>) => {
    nuxt.seo = input;
});

mockNuxtImport("useSeoTitleTemplate", () => (seoTitle: () => string | undefined) => {
    nuxt.signedTitle = seoTitle;
});

const setUp = (route = "/la-culpa/") =>
    withSetup(() => useArticle(), { route }).then(
        ({ value }) => ({ controller: value, failure: undefined }),
        (failure: unknown) => ({ controller: undefined, failure }),
    );

const seo = (field: string) => (nuxt.seo[field] as () => unknown)();

const unregisters: (() => void)[] = [];

const FAILING = () => new Response("Upstream failed", { status: 500 });

/** Serves the article; the related list, the comments and the author counts all fail. */
const serve = (article: () => unknown) => {
    unregisters.push(
        registerEndpoint("/api/articles/la-culpa", article),
        registerEndpoint("/api/articles/la-culpa/related", FAILING),
        registerEndpoint("/api/articles/la-culpa/comments", FAILING),
        registerEndpoint("/api/authors", FAILING),
    );
};

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    nuxt.fetches.clear();
    nuxt.seo = {};
    clearNuxtData();
    serve(() => ARTICLE);
});

afterEach(() => {
    unregisters.splice(0).forEach((unregister) => unregister());
});

describe("useArticle", () => {
    it("reads the article named by the route, its related posts, its comments and the author counts", async () => {
        await setUp("/la-culpa/");

        expect([...nuxt.fetches.keys()].sort()).toEqual([
            "/api/articles/la-culpa",
            "/api/articles/la-culpa/comments",
            "/api/articles/la-culpa/related",
            "/api/authors",
        ]);
    });

    it("reads the comments in the browser only, without blocking navigation on them", async () => {
        await setUp();

        expect(nuxt.fetches.get("/api/articles/la-culpa/comments")).toMatchObject({
            server: false,
            lazy: true,
        });
    });

    it("server-renders the related posts without blocking navigation on them", async () => {
        await setUp();

        expect(nuxt.fetches.get("/api/articles/la-culpa/related")).toMatchObject({ lazy: true });
        expect(nuxt.fetches.get("/api/articles/la-culpa/related")).not.toHaveProperty("server");
    });

    it("still serves the article when the related list, the comments or the author counts fail", async () => {
        expect((await setUp()).failure).toBeUndefined();
    });

    describe("author counts", () => {
        it("reads them lazily under a key of their own", async () => {
            await setUp();

            expect(nuxt.fetches.get("/api/authors")).toMatchObject({
                key: "author-counts",
                lazy: true,
            });
        });

        it("server-renders them, so a prerendered article carries them in its payload", async () => {
            await setUp();

            expect(nuxt.fetches.get("/api/authors")).not.toHaveProperty("server");
        });

        it("keeps only each author's count, so the article's payload carries no bios", async () => {
            await setUp();

            const { transform } = nuxt.fetches.get("/api/authors") as {
                transform: (authors: Facet<Author>[]) => Record<string, number>;
            };
            const author = fakeAuthor();

            expect(transform([{ value: author, count: 4 }])).toEqual({ [author.id]: 4 });
        });
    });

    it("throws a fatal 404 when the post doesn't exist", async () => {
        unregisters.splice(0).forEach((unregister) => unregister());
        serve(() => new Response("Not found", { status: 404 }));

        expect((await setUp()).failure).toMatchObject({ status: 404, fatal: true });
    });

    describe("SEO", () => {
        it("prefers the CMS's SEO title and description over the article's own", async () => {
            unregisters.splice(0).forEach((unregister) => unregister());
            serve(() => ({
                ...ARTICLE,
                seo: { title: "La culpa | Huella", description: "Resumen SEO" },
            }));

            await setUp();

            expect([seo("title"), seo("description")]).toEqual([
                "La culpa | Huella",
                "Resumen SEO",
            ]);
        });

        it("falls back to the title and excerpt", async () => {
            await setUp();

            expect([seo("title"), seo("description")]).toEqual([
                "La culpa",
                "El deber de cuidado.",
            ]);
            expect(seo("robots")).toBeUndefined();
        });

        it("tells the title template which title the CMS wrote", async () => {
            unregisters.splice(0).forEach((unregister) => unregister());
            serve(() => ({ ...ARTICLE, seo: { title: "La culpa | Huella" } }));

            await setUp();

            expect(nuxt.signedTitle()).toBe("La culpa | Huella");
        });

        it("keeps a post the CMS marks noindex out of search", async () => {
            unregisters.splice(0).forEach((unregister) => unregister());
            serve(() => ({ ...ARTICLE, seo: { noindex: true } }));

            await setUp();

            expect(seo("robots")).toBe("noindex");
        });
    });
});
