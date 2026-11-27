import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { projectView, readProject, readTemplate } from "#layers/workflows/shared/workflows.ts";
import List from "./List.vue";

const MESSAGES = {
    workflowList: {
        filter: "Filter blocks",
        none: "Nothing matches {term}",
    },
};

const { template } = readTemplate({
    id: "t",
    title: "T",
    stages: [
        { id: "build", title: "Build" },
        { id: "launch", title: "Launch" },
    ],
    capabilities: [
        { id: "kit", stage: "build", title: "Design kit" },
        { id: "page", stage: "build", title: "Article page", dependsOn: ["kit"] },
        { id: "comments", stage: "build", title: "Comments", optional: true, default: false },
        { id: "cutover", stage: "launch", title: "Domain cutover", dependsOn: ["page"] },
    ],
});
const { project } = readProject({ id: "p", title: "P", template: "t", milestone: "P" });
const view = projectView(project, template, null);

const mount = (selected: string | null = null, term = "") =>
    mountSuspended(List, {
        props: { stages: view.stages, selected, term },
        global: { stubs: { UIcon: true } },
    });

const rows = (wrapper: Awaited<ReturnType<typeof mount>>) =>
    wrapper.findAll("tr[data-block]").map((row) => row.attributes("data-block"));

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowList", () => {
    it("lists every switched-on block, leaving a switched-off one out", async () => {
        const wrapper = await mount();

        expect(rows(wrapper)).toEqual(["kit", "page", "cutover"]);
    });

    it("finds a block by any words of its title, dropping the stages left empty", async () => {
        const wrapper = await mount(null, "cutover DOMAIN");

        expect(rows(wrapper)).toEqual(["cutover"]);
        expect(wrapper.text()).not.toContain("Build");
    });

    it("says nothing matched instead of drawing an empty table", async () => {
        const wrapper = await mount(null, "newsletter");

        expect(wrapper.text()).toContain("Nothing matches newsletter");
    });

    it("leaves the page where it is when the selection is cleared", async () => {
        const scroll = vi
            .spyOn(HTMLElement.prototype, "scrollIntoView")
            .mockImplementation(() => {});
        const wrapper = await mountSuspended(List, {
            props: { stages: view.stages, selected: "kit", term: "" },
            global: { stubs: { UIcon: true } },
            attachTo: document.body,
        });

        await wrapper.setProps({ selected: null });
        await new Promise((resolve) => setTimeout(resolve));

        expect(scroll).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it("selects a block from its row's button", async () => {
        const wrapper = await mount();

        await wrapper.find("tr[data-block='page'] button").trigger("click");

        expect(wrapper.emitted("select")).toEqual([["page"]]);
    });

    it.each([
        ["page", "ArrowDown", "cutover"],
        ["page", "ArrowUp", "kit"],
        [null, "ArrowDown", "kit"],
    ])("moves from %s on %s to %s, across stages", async (from, key, to) => {
        const wrapper = await mount(from);

        await wrapper.find("table").trigger("keydown", { key });

        expect(wrapper.emitted("select")).toEqual([[to]]);
    });
});
