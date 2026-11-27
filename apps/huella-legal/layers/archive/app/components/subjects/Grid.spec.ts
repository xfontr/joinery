import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import SubjectsGrid from "./Grid.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

const PENAL = {
    id: "1",
    slug: "derecho-penal",
    name: "Derecho penal",
    description: "Teoría del delito.",
};
const CIVIL = { id: "2", slug: "derecho-civil", name: "Derecho civil" };

const props = {
    subjects: [
        { value: PENAL, count: 3 },
        { value: CIVIL, count: 1 },
    ],
};

describe("subjects grid", () => {
    it("links every subject to its own listing", async () => {
        const wrapper = await mountSuspended(SubjectsGrid, { props, global });

        expect(wrapper.findAll("li a").map((link) => link.attributes("href"))).toEqual([
            "/areas/derecho-penal/",
            "/areas/derecho-civil/",
        ]);
    });
});
