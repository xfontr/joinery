import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import NavSubjectsPanel from "./SubjectsPanel.vue";

const subject = (slug: string, count: number): Facet<Category> => ({
    value: { id: slug, slug, name: slug },
    count,
});

const SUBJECTS = [
    subject("abogacia", 3),
    subject("derecho-civil", 8),
    subject("derecho-penal", 12),
    subject("derecho-laboral", 2),
    subject("derecho-mercantil", 4),
    subject("derechos-fundamentales", 6),
    subject("teoria-del-derecho", 5),
    subject("derecho-procesal", 7),
    subject("derecho-administrativo", 1),
];

const HOME: Home = {
    latest: [],
    recent: [],
    theses: [],
    subjects: SUBJECTS,
    formats: [],
};

/** Mounts the panel over a home route answering with `answer`, once the read has settled. */
const mountPanel = async (answer: () => unknown = () => HOME) => {
    // useCachedFetch serves a payload it already holds, which would outlive the previous mount
    clearNuxtData();
    serveEndpoint("/api/home", answer);
    const wrapper = await mountSuspended(NavSubjectsPanel, {
        global: { mocks: { $t: (key: string) => `t(${key})` } },
    });
    await flushPromises();
    return wrapper;
};

describe("subjects panel", () => {
    it("lists the eight biggest areas, biggest first, then the whole index", async () => {
        const wrapper = await mountPanel();

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual([
            "/areas/derecho-penal/",
            "/areas/derecho-civil/",
            "/areas/derecho-procesal/",
            "/areas/derechos-fundamentales/",
            "/areas/teoria-del-derecho/",
            "/areas/derecho-mercantil/",
            "/areas/abogacia/",
            "/areas/derecho-laboral/",
            "/areas/",
        ]);
    });

    it("links the whole index while the areas load, so an open panel always leads somewhere", async () => {
        const wrapper = await mountPanel(() => new Promise(() => {}));

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual(["/areas/"]);
        expect(wrapper.text()).toContain("t(common.loading)");
    });
});
