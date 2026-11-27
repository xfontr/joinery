import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import ArticleView from "./View.vue";

const ARTICLE: Article = {
    id: "1",
    slug: "la-culpa",
    title: "La culpa",
    authors: [],
    tags: [],
    category: { id: "2", slug: "derecho-penal", name: "Derecho penal" },
    format: "comentario",
    readingMinutes: 12,
    body: { lead: "<p>Uno</p>", html: "", toc: [], notes: [], bibliography: [] },
    permalink: "https://revista.test/la-culpa/",
    citations: [],
};

const RELATED: ArticleSummary = {
    id: "5",
    slug: "el-dolo",
    title: "El dolo",
    authors: [],
    tags: [],
    format: "articulo",
    readingMinutes: 6,
};

const COMMENTS: ArticleComments = { open: true, count: 3, threads: [] };

const serve = (article: unknown, comments: unknown = undefined) => {
    serveEndpoint("/api/articles/la-culpa", () => article);
    serveEndpoint("/api/articles/la-culpa/related", () => [RELATED]);
    serveEndpoint("/api/articles/la-culpa/comments", () => comments);
    serveEndpoint("/api/authors", () => []);
};

const mount = (options: Parameters<typeof mountSuspended>[1] = {}) =>
    mountSuspended(ArticleView, { route: "/la-culpa/", ...options });

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

describe("article view", () => {
    it("renders the article useArticle read, with its related band", async () => {
        serve(ARTICLE);

        const wrapper = await mount();

        expect(wrapper.find("h1").text()).toBe("La culpa");
        await vi.waitFor(() => expect(wrapper.find('a[href="/el-dolo/"]').exists()).toBe(true));
    });

    it("leaves out the related band for an uncategorised article", async () => {
        serve({ ...ARTICLE, category: undefined });

        const wrapper = await mount();

        await vi.waitFor(() => expect(wrapper.find("h1").exists()).toBe(true));
        expect(wrapper.find('a[href="/el-dolo/"]').exists()).toBe(false);
    });

    it("links the header's comment count to the thread once the comments arrive", async () => {
        serve(ARTICLE, COMMENTS);

        const wrapper = await mount();

        await vi.waitFor(() => expect(wrapper.find('a[href$="#comentarios"]').exists()).toBe(true));
    });

    it("hands the article and its thread to the page's comments slot", async () => {
        serve(ARTICLE, COMMENTS);

        const wrapper = await mount({
            slots: {
                comments: ({
                    article,
                    comments,
                }: {
                    article: Article;
                    comments?: ArticleComments;
                }) => h("p", { id: "thread" }, `${article.slug} ${comments?.count}`),
            },
        });

        await vi.waitFor(() => expect(wrapper.find("#thread").text()).toBe("la-culpa 3"));
    });

    it("renders nothing rather than an empty article while there is no post", async () => {
        serve(undefined);

        const wrapper = await mount();

        expect(wrapper.find("article").exists()).toBe(false);
    });
});
