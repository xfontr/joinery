import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Left from "./Left.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "page", stage: "build", title: "Page" },
        { id: "nav", stage: "build", title: "Nav" },
        { id: "launch", stage: "build", title: "Launch", dependsOn: ["page", "nav"] },
    ],
};

const LEFT =
    assembleWorkflows(
        [{ file: "site.yaml", ok: true, value: TEMPLATE }],
        [
            {
                file: "blog.yaml",
                ok: true,
                value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
            },
        ],
        {},
    ).projects[0]?.left ?? [];

describe("WorkflowLeft", () => {
    it("groups the blocks left by state, each with its count", async () => {
        const wrapper = await mountSuspended(Left, {
            props: { blocks: LEFT, selected: null, blank: false },
        });

        const counts = wrapper.findAll("li > button").map((group) => group.find("span").text());
        expect(counts.reduce((sum, count) => sum + Number(count), 0)).toBe(3);
    });

    it("reports the block picked from a state's list", async () => {
        const wrapper = await mountSuspended(Left, {
            props: { blocks: LEFT, selected: null, blank: false },
        });

        await wrapper.findComponent({ name: "UPopover" }).setValue(true, "open");
        await flushPromises();
        document.body.querySelector<HTMLButtonElement>("ul[aria-label$=' blocks'] button")?.click();

        expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it("tells a blank project from a finished one", async () => {
        const blank = await mountSuspended(Left, {
            props: { blocks: [], selected: null, blank: true },
        });
        const done = await mountSuspended(Left, {
            props: { blocks: [], selected: null, blank: false },
        });

        expect(blank.text()).not.toBe(done.text());
    });
});
