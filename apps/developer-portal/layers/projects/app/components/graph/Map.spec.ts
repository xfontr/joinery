import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import type { ElementDefinition } from "cytoscape";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import GraphMap from "./Map.vue";

const MESSAGES = {
    graphMap: {
        all: "Everything",
        applications: "Apps",
        empty: "Nothing yet",
        fit: "Fit",
        focus: "Focus {name}",
        group: "Group",
        label: "Graph",
        lead: "Lead",
        leftToRight: "Sideways",
        libraries: "Libs",
        reset: "Reset",
        search: "Search",
        title: "Map",
        topToBottom: "Downwards",
    },
};

// happy-dom has no 2d canvas, so the renderer is replaced by a core that keeps what it was given.
const graph = vi.hoisted(() => ({
    elements: [] as ElementDefinition[],
    layouts: [] as string[],
    handlers: new Map<string, (event: unknown) => void>(),
}));

vi.mock("cytoscape", () => {
    const core = () => ({
        on: (event: string, _selector: string, handler: (event: unknown) => void) =>
            graph.handlers.set(event, handler),
        add: (elements: ElementDefinition[]) => {
            graph.elements = elements;
        },
        elements: () => ({ remove: () => {} }),
        layout: ({ rankDir }: { rankDir: string }) => ({
            run: () => graph.layouts.push(rankDir),
        }),
        destroy: () => {},
    });
    return { default: Object.assign(core, { use: () => {} }) };
});

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
mockNuxtImport("navigateTo", () => navigate);

const project = (root: string, type: "app" | "lib", links: Partial<ProjectNode> = {}) =>
    ({
        name: `@joinery/${root.split("/")[1]}`,
        root,
        type,
        tags: [],
        dependsOn: [],
        dependedOnBy: [],
        ...links,
    }) satisfies ProjectNode;

const SITE = project("apps/site", "app", { dependsOn: ["@joinery/ui"] });
const BLOG = project("apps/blog", "app");
const UI = project("packages/ui", "lib", { dependedOnBy: ["@joinery/site"] });
const PROJECTS = [SITE, BLOG, UI];

const shown = () =>
    graph.elements.filter(({ data }) => data.parent !== undefined).map(({ data }) => data.id);

const button = (wrapper: VueWrapper, name: string) => wrapper.find(`button[aria-label='${name}']`);

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
    graph.elements = [];
    graph.layouts = [];
    graph.handlers.clear();
});

describe("GraphMap", () => {
    it("boxes every project in its folder, under its full name, with its dependencies", async () => {
        await mountSuspended(GraphMap, { props: { projects: PROJECTS } });

        expect(graph.elements.map(({ data }) => data.id)).toEqual([
            "folder:apps",
            "folder:packages",
            "@joinery/site",
            "@joinery/blog",
            "@joinery/ui",
            "@joinery/site>@joinery/ui",
        ]);
    });

    it("lists applications apart from libraries, the way Nx's side panel does", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: PROJECTS } });
        const section = (heading: string) =>
            wrapper
                .findAll("section")
                .find((found) => found.find("h3").text() === heading)!
                .text();

        expect(section("Apps")).toContain("@joinery/site");
        expect(section("Apps")).not.toContain("@joinery/ui");
        expect(section("Libs")).toContain("@joinery/ui");
    });

    it("takes an unticked project off the graph", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: PROJECTS } });

        await wrapper.find("button[role=checkbox]").trigger("click");

        expect(shown()).toEqual(["@joinery/blog", "@joinery/ui"]);
    });

    it("narrows the graph to a focused project's chain until All is pressed", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: PROJECTS } });

        await button(wrapper, "Focus @joinery/ui").trigger("click");
        expect(shown()).toEqual(["@joinery/site", "@joinery/ui"]);

        await wrapper
            .findAll("button")
            .find((found) => found.text() === "Everything")!
            .trigger("click");
        expect(shown()).toHaveLength(3);
    });

    it("lays the graph out sideways when the direction is switched", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: PROJECTS } });

        await button(wrapper, "Sideways").trigger("click");

        expect(graph.layouts).toEqual(["TB", "LR"]);
    });

    it("opens a project's page when its node is selected", async () => {
        await mountSuspended(GraphMap, { props: { projects: PROJECTS } });

        graph.handlers.get("tap")?.({ target: { data: () => "/projects/site" } });

        expect(navigate).toHaveBeenCalledWith("/projects/site");
    });

    it("says nothing was collected rather than drawing an empty frame", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: [] } });

        expect(wrapper.text()).toContain("Nothing yet");
        expect(wrapper.find("[role=img]").exists()).toBe(false);
    });
});
