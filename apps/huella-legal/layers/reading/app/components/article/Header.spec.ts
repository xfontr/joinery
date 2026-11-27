import type { VueWrapper } from "@vue/test-utils";
import { fakeAuthor } from "@joinery/content/testing";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ArticleHeader from "./Header.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

const ARTICLE: Article = {
    id: "1",
    slug: "la-culpa",
    title: "La culpa",
    excerpt: "El deber de cuidado.",
    publishedAt: "2024-03-12T09:00:00Z",
    authors: [fakeAuthor()],
    category: { id: "2", slug: "derecho-penal", name: "Derecho penal" },
    tags: [],
    format: "comentario",
    readingMinutes: 12,
    body: { lead: "", html: "", toc: [], notes: [], bibliography: [] },
    permalink: "https://revista.test/la-culpa/",
    citations: [],
};

const hrefsIn = (wrapper: VueWrapper, selector: string) =>
    wrapper
        .find(selector)
        .findAll("a")
        .map((link) => link.attributes("href"));

describe("article header", () => {
    it("ends the breadcrumb at the article's category", async () => {
        const wrapper = await mountSuspended(ArticleHeader, {
            props: { article: ARTICLE },
            global,
        });

        expect(hrefsIn(wrapper, "nav")).toEqual(["/", "/publicaciones/", "/areas/derecho-penal/"]);
        expect(wrapper.find("nav").text()).toContain("Derecho penal");
    });

    it("stops the breadcrumb at the publications when the article has no category", async () => {
        const wrapper = await mountSuspended(ArticleHeader, {
            props: { article: { ...ARTICLE, category: undefined } },
            global,
        });

        expect(hrefsIn(wrapper, "nav")).toEqual(["/", "/publicaciones/"]);
    });

    it("labels the format without repeating the category", async () => {
        const wrapper = await mountSuspended(ArticleHeader, {
            props: { article: ARTICLE },
            global,
        });

        const kicker = wrapper.find("h1").element.previousElementSibling!;

        expect(kicker.textContent).toContain("article.formats.comment");
        expect(kicker.textContent).not.toContain("Derecho penal");
    });
});
