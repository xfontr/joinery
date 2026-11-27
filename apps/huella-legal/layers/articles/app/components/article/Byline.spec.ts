import { fakeAuthor } from "@joinery/content/testing";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Byline from "./Byline.vue";

const global = {
    mocks: {
        $t: (key: string, params: Record<string, unknown>) =>
            `t(${key}, ${JSON.stringify(params)})`,
    },
};

const ANA = { ...fakeAuthor({ name: "Ana de la Torre" }), to: "/colaboradores/ana" };
const LUIS = { ...fakeAuthor({ name: "Luis Martín" }), to: "/colaboradores/luis" };
const MARTA = { ...fakeAuthor({ name: "Marta Gil" }), to: "/colaboradores/marta" };

describe("article byline", () => {
    it('joins names the Spanish way, with commas and a final "y"', async () => {
        const wrapper = await mountSuspended(Byline, {
            props: { authors: [ANA, LUIS, MARTA] },
            global,
        });

        expect(wrapper.find("li").text()).toBe("Ana de la Torre, Luis Martín y Marta Gil");
    });

    it("links each name to its own author's profile, not the separators", async () => {
        const wrapper = await mountSuspended(Byline, { props: { authors: [ANA, LUIS] }, global });

        const links = wrapper.findAll("a").map((link) => [link.text(), link.attributes("href")]);

        expect(links).toEqual([
            ["Ana de la Torre", "/colaboradores/ana"],
            ["Luis Martín", "/colaboradores/luis"],
        ]);
    });

    it("prints the date in Madrid, so a late-night post never shows the day before", async () => {
        const wrapper = await mountSuspended(Byline, {
            props: { authors: [LUIS], publishedAt: "2024-03-11T23:30:00Z" },
            global,
        });

        const time = wrapper.find("time");

        expect(time.text()).toBe("12 de marzo de 2024");
        expect(time.attributes("datetime")).toBe("2024-03-11T23:30:00Z");
    });

    it("links the comment count where it's told to, with the count as the plural", async () => {
        const wrapper = await mountSuspended(Byline, {
            props: { authors: [LUIS], comments: { count: 3, to: { hash: "#comentarios" } } },
            global,
        });

        const link = wrapper.find('a[href$="#comentarios"]');

        expect(link.text()).toBe('t(articleByline.comments, {"count":3})');
    });

    it("prints no comment count at zero", async () => {
        const wrapper = await mountSuspended(Byline, {
            props: { authors: [LUIS], comments: { count: 0, to: { hash: "#comentarios" } } },
            global,
        });

        expect(wrapper.text()).not.toContain("articleByline.comments");
    });
});
