import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import HomeHero from "./Hero.vue";

const MESSAGES = { homeHero: { title: "title {emphasis}", emphasis: "emphasis" } };

describe("home hero", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("is the page's only h1, with its emphasis inside the heading", async () => {
        const wrapper = await mountSuspended(HomeHero);

        expect(wrapper.findAll("h1")).toHaveLength(1);
        expect(wrapper.find("h1 em").text()).toBe("emphasis");
    });
});
