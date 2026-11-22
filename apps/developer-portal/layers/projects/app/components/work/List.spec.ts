import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { WORK } from "#layers/projects/shared/work.ts";
import WorkList from "./List.vue";

describe("WorkList", () => {
    it("leads with the first case's screenshot and shows no other", async () => {
        const wrapper = await mountSuspended(WorkList);

        expect(wrapper.findAll("img")).toHaveLength(1);
        expect(wrapper.get("img").attributes("src")).toBeTruthy();
    });

    it("links each case to its study and each tool to where it can be seen", async () => {
        const wrapper = await mountSuspended(WorkList);

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining([
                ...WORK.map((work) => `/work/${work.slug}`),
                "/wiki/apps/wp-editor/readme",
                "/overview",
            ]),
        );
    });
});
