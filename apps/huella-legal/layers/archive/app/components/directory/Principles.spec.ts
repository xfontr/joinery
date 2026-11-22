import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import DirectoryPrinciples from "./Principles.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("directory principles", () => {
    it("names the section for assistive tech, since it has no heading of its own", async () => {
        const wrapper = await mountSuspended(DirectoryPrinciples, { global });

        expect(wrapper.attributes("aria-label")).toBe("t(directoryPrinciples.label)");
    });

    it("numbers the principles from one, keeping the number out of the accessible text", async () => {
        const wrapper = await mountSuspended(DirectoryPrinciples, { global });
        const numbers = wrapper.findAll("ol > li > span");

        expect(numbers.map((number) => number.text())).toEqual(["1", "2", "3"]);
        expect(numbers.every((number) => number.attributes("aria-hidden") === "true")).toBe(true);
        expect(wrapper.findAll("ol > li > h2").map((title) => title.text())).toEqual([
            "t(directoryPrinciples.rigour.title)",
            "t(directoryPrinciples.accessibility.title)",
            "t(directoryPrinciples.openAccess.title)",
        ]);
    });
});
