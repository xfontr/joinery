import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { faker, fakeAuthor } from "@joinery/content/testing";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { createError } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchPalette from "./Palette.vue";

const article = (id: string): ArticleSummary => ({
    id,
    slug: `articulo-${id}`,
    title: `Artículo ${id}`,
    excerpt: faker.lorem.sentence(),
    authors: [fakeAuthor()],
    tags: [],
    format: "articulo",
    readingMinutes: 5,
});

const subject = (name: string, count: number) => ({
    value: { id: name, slug: normalizeText(name).replaceAll(" ", "-"), name },
    count,
});

const HOME: Home = {
    latest: ["1", "2", "3", "4", "5"].map(article),
    recent: [],
    theses: [],
    subjects: [
        subject("Abogacía", 3),
        subject("Derecho civil", 8),
        subject("Derecho penal", 12),
        subject("Derecho laboral", 2),
        subject("Derecho mercantil", 4),
        subject("Derechos fundamentales", 6),
        subject("Teoría del Derecho", 5),
    ],
    formats: [],
};

const SEARCH: ArticleSearch = {
    items: ["a", "b", "c", "d", "e", "f"].map(article),
    page: 1,
    perPage: 20,
    total: 51,
    totalPages: 3,
    query: "penal",
    subjects: [],
};

const mountPalette = async (typed = "", search?: ArticleSearch) => {
    let asked = false;

    serveEndpoint("/api/home", () => HOME);
    serveEndpoint("/api/search", () => {
        asked = true;

        if (!search) throw createError({ statusCode: 404 });

        return search;
    });

    const wrapper = await mountSuspended(SearchPalette, {
        global: { mocks: { $t: (key: string) => `t(${key})` } },
    });

    await vi.waitFor(() => expect(wrapper.find("[role='option']").exists()).toBe(true));

    if (typed) {
        await wrapper.find("input").setValue(typed);
        await vi.waitFor(() => expect(asked).toBe(true));
    }
    await flushPromises();

    return wrapper;
};

const options = (wrapper: Awaited<ReturnType<typeof mountPalette>>) =>
    wrapper.findAll("[role='option']");

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

describe("search palette", () => {
    it("offers the biggest subjects and the latest articles before anything is typed", async () => {
        const wrapper = await mountPalette();

        const hrefs = options(wrapper).map((option) => option.attributes("href"));

        expect(hrefs).toEqual([
            "/areas/derecho-penal/",
            "/areas/derecho-civil/",
            "/areas/derechos-fundamentales/",
            "/areas/teoria-del-derecho/",
            "/areas/derecho-mercantil/",
            "/areas/abogacia/",
            "/articulo-1/",
            "/articulo-2/",
            "/articulo-3/",
            "/articulo-4/",
        ]);
    });

    it("puts the full results page first once there is a query, so Enter opens it", async () => {
        const wrapper = await mountPalette("penal", SEARCH);

        expect(options(wrapper)[0]?.attributes("href")).toBe("/buscar/?query=penal");
        expect(options(wrapper)[0]?.text()).toContain("searchPalette.total");
    });

    it("searches everything typed so far, even before the preview has caught up", async () => {
        const wrapper = await mountPalette(" culpabilidad ");

        expect(options(wrapper)[0]?.attributes("href")).toBe("/buscar/?query=culpabilidad");
    });

    it("counts results only for the query they answer, never a stale one", async () => {
        const wrapper = await mountPalette("penal dolo", SEARCH);

        expect(options(wrapper)[0]?.text()).not.toContain("searchPalette.total");
    });

    it("matches subjects without accents, so «teoria» finds «Teoría del Derecho»", async () => {
        const wrapper = await mountPalette("teoria", { ...SEARCH, items: [] });

        expect(options(wrapper).map((option) => option.attributes("href"))).toEqual([
            "/buscar/?query=teoria",
            "/areas/teoria-del-derecho/",
        ]);
    });

    it("previews only the first five matches, leaving the rest to the results page", async () => {
        const wrapper = await mountPalette("penal", SEARCH);

        const articles = options(wrapper).filter((option) =>
            option.attributes("href")?.startsWith("/articulo-"),
        );

        expect(articles).toHaveLength(5);
    });

    it("closes once a row is chosen, so the dialog is not left over the next page", async () => {
        const wrapper = await mountPalette();

        await options(wrapper)[0]!.trigger("click");

        expect(wrapper.emitted("close")).toHaveLength(1);
    });
});
