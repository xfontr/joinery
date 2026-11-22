import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutIntro from "./Intro.vue";

const props = { articles: 132, authors: 47 };

describe("about intro", () => {
    it("is the page's only h1", async () => {
        const wrapper = await mountSuspended(AboutIntro, { props });

        expect(wrapper.findAll("h1")).toHaveLength(1);
    });

    it("keeps every figure in the text, under its label", async () => {
        const wrapper = await mountSuspended(AboutIntro, { props });

        expect(wrapper.findAll("dd").map((figure) => figure.text())).toEqual(["132", "47"]);
        expect(wrapper.findAll("dt")).toHaveLength(2);
    });

    it("hands each count its target and its place in the stagger", async () => {
        const wrapper = await mountSuspended(AboutIntro, { props });

        expect(
            wrapper.findAll(".hl-about-count").map((count) => count.attributes("style")),
        ).toEqual(["--about-to: 132;", "--about-to: 47;"]);
        expect(wrapper.findAll("dl > div").map((figure) => figure.attributes("style"))).toEqual([
            "--step: 0;",
            "--step: 1;",
        ]);
    });

    it("draws its fingerprint on load", async () => {
        const wrapper = await mountSuspended(AboutIntro, { props });

        expect(wrapper.find(".hl-about-fingerprint").attributes("data-waiting")).toBeUndefined();
    });

    it("leads the breadcrumb home", async () => {
        const wrapper = await mountSuspended(AboutIntro, { props });

        expect(wrapper.find("nav a").attributes("href")).toBe("/");
    });
});
