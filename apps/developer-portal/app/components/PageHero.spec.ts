import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PageHero from "./PageHero.vue";

describe("PageHero", () => {
    it("sets only the title's last words in the accent", () => {
        const wrapper = mount(PageHero, { props: { title: "Case", mark: "studies", lead: "Who" } });

        expect(wrapper.find("h1").text()).toBe("Case studies");
        expect(wrapper.find("h1 mark").text()).toBe("studies");
    });

    it("prints a kicker only when it is given one", () => {
        const bare = mount(PageHero, { props: { title: "Case", mark: "studies", lead: "Who" } });
        const kicked = mount(PageHero, {
            props: { kicker: "Case study", title: "Huella", mark: "Legal", lead: "A magazine" },
        });

        expect(bare.findAll("p")).toHaveLength(1);
        expect(kicked.find("p").text()).toBe("Case study");
    });
});
