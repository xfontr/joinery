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
});
