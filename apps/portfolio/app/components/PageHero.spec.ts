import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PageHero from "./PageHero.vue";

describe("PageHero", () => {
    it("sets only the title's last words in the accent", () => {
        const wrapper = mount(PageHero, { props: { title: "Case", mark: "studies", lead: "Who" } });

        expect(wrapper.find("h1").text()).toBe("Case studies");
        expect(wrapper.find("h1 mark").text()).toBe("studies");
    });
});
