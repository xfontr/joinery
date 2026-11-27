import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import NoResults from "./NoResults.vue";

const MESSAGES = {
    noResults: {
        broaden: "broaden",
        browse: "browse",
        title: "title: {query}",
    },
};

const SUBJECTS = [
    { label: "Derecho penal", to: "/areas/penal" },
    { label: "Derecho civil", to: "/areas/civil" },
];

describe("no results", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("repeats the query in the heading, so the reader sees what was searched", async () => {
        const wrapper = await mountSuspended(NoResults, {
            props: { query: "kardashov", subjects: SUBJECTS },
        });

        expect(wrapper.find("h2").text()).toBe("title: kardashov");
    });

    it("offers the subjects as a way out, and leaves the row out when there are none", async () => {
        const withSubjects = await mountSuspended(NoResults, {
            props: { query: "kardashov", subjects: SUBJECTS },
        });
        const without = await mountSuspended(NoResults, {
            props: { query: "kardashov", subjects: [] },
        });

        expect(withSubjects.findAll("a").map((link) => link.attributes("href"))).toEqual([
            "/areas/penal",
            "/areas/civil",
        ]);
        expect(without.text()).not.toContain("browse");
    });
});
