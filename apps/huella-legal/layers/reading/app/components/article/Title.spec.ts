import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ArticleTitle from "./Title.vue";

const PROPS = {
    breadcrumb: [{ label: "Portada", to: "/" }, { label: "Aviso legal" }],
    title: "Aviso legal",
};

describe("article title", () => {
    it("heads the page with the breadcrumb and the title", async () => {
        const wrapper = await mountSuspended(ArticleTitle, { props: PROPS });

        expect(wrapper.find("nav a").attributes("href")).toBe("/");
        expect(wrapper.find("h1").text()).toBe("Aviso legal");
    });

    it("puts the kicker between the breadcrumb and the title, and the rest after it", async () => {
        const wrapper = await mountSuspended(ArticleTitle, {
            props: PROPS,
            slots: { kicker: () => "Ensayo", default: () => "Entradilla" },
        });

        const html = wrapper.html();

        expect(html.indexOf("Ensayo")).toBeLessThan(html.indexOf("<h1"));
        expect(html.indexOf("Entradilla")).toBeGreaterThan(html.indexOf("</h1>"));
    });
});
