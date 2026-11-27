import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import SubjectsSectionNav from "./SectionNav.vue";

const global = {
    mocks: { $t: (key: string, params?: { count: number }) => `t(${key}, ${params?.count})` },
};

const CATEGORY = { id: "1", slug: "derecho-penal", name: "Derecho penal" };

const index = {
    subjects: [{ value: CATEGORY, count: 3 }],
    formats: [
        { value: "articulo", count: 4 },
        { value: "tfg-tfm", count: 1 },
    ],
    topics: [],
} satisfies SubjectIndex;

describe("subjects section nav", () => {
    it("counts what each section holds", async () => {
        const wrapper = await mountSuspended(SubjectsSectionNav, { props: { index }, global });

        expect(wrapper.findAll("a").map((link) => link.text())).toEqual([
            "t(subjectsSectionNav.subjects, 1)",
            "t(subjectsSectionNav.formats, 2)",
            "t(subjectsSectionNav.topics, 0)",
        ]);
    });
});
