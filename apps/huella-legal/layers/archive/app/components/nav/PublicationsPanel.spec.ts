import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { fakeAuthor } from "@joinery/content/testing";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import NavPublicationsPanel from "./PublicationsPanel.vue";

const MESSAGES = {
    common: { loading: "loading" },
    navPublicationsPanel: { latest: "latest previews" },
};

const article = (id: string): ArticleSummary => ({
    id,
    slug: `articulo-${id}`,
    title: `Artículo ${id}`,
    authors: [fakeAuthor()],
    tags: [],
    format: "articulo",
    readingMinutes: 5,
});

const HOME: Home = {
    lead: article("lead"),
    latest: ["1", "2", "3"].map(article),
    recent: [],
    theses: [],
    subjects: [],
    formats: [],
};

/** Mounts the panel over a home route answering with `answer`, once the read has settled. */
const mountPanel = async (answer: () => unknown = () => HOME) => {
    // useCachedFetch serves a payload it already holds, which would outlive the previous mount
    clearNuxtData();
    serveEndpoint("/api/home", answer);
    const wrapper = await mountSuspended(NavPublicationsPanel);
    await flushPromises();
    return wrapper;
};

const hrefs = (wrapper: VueWrapper) => wrapper.findAll("a").map((link) => link.attributes("href"));

describe("publications panel", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("previews the lead and then the latest, three in all, after the ways to browse", async () => {
        const wrapper = await mountPanel();

        expect(hrefs(wrapper)).toEqual([
            "/publicaciones/",
            "/publicaciones/?format=articulo",
            "/publicaciones/?format=comentario",
            "/publicaciones/?format=tfg-tfm",
            "/buscar/",
            "/articulo-lead/",
            "/articulo-1/",
            "/articulo-2/",
        ]);
        expect(wrapper.text()).toContain("latest previews");
    });

    it("offers the ways to browse while the previews load, so an open panel is never empty", async () => {
        const wrapper = await mountPanel(() => new Promise(() => {}));

        expect(hrefs(wrapper)).toHaveLength(5);
        expect(wrapper.text()).toContain("loading");
    });

    it("drops the previews when the home data failed, rather than a heading over nothing", async () => {
        const wrapper = await mountPanel(() => new Response("Upstream failed", { status: 500 }));

        expect(wrapper.text()).not.toContain("latest previews");
        expect(hrefs(wrapper)).toHaveLength(5);
    });
});
