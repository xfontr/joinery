import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TermList from "./TermList.vue";

const ITEMS = [
    { id: "pick", term: "Pick", detail: "Takes the next ticket." },
    { id: "ship", term: "Ship", detail: "Merges it." },
];

describe("TermList", () => {
    it("numbers the terms only when their order matters", () => {
        expect(mount(TermList, { props: { items: ITEMS, ordered: true } }).element.tagName).toBe(
            "OL",
        );
        expect(mount(TermList, { props: { items: ITEMS } }).element.tagName).toBe("UL");
    });

    it("pairs every term with its own detail", () => {
        const wrapper = mount(TermList, { props: { items: ITEMS } });

        expect(
            wrapper.findAll("li").map((item) => item.findAll("span").map((span) => span.text())),
        ).toEqual([
            ["Pick", "Takes the next ticket."],
            ["Ship", "Merges it."],
        ]);
    });

    it("sets only the marked words of a detail in bold", () => {
        const items = [{ id: "a", term: "A", detail: "Then came **the scripts**, fast." }];
        const detail = mount(TermList, { props: { items } }).findAll("li span")[1]!;

        expect(detail.find("strong").text()).toBe("the scripts");
        expect(detail.text()).toBe("Then came the scripts, fast.");
    });
});
