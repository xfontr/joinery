import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Summary from "./Summary.vue";

const MESSAGES = {
    workflowSummary: {
        tickets: "{filed}/{total} tickets filed",
    },
    workflows: {
        capabilityState: {
            "can-file": "Can file now",
        },
    },
};

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "page", stage: "build", title: "Page" },
        { id: "nav", stage: "build", title: "Nav" },
    ],
};

const VIEW = assembleWorkflows(
    [{ file: "site.yaml", ok: true, value: TEMPLATE }],
    [
        {
            file: "blog.yaml",
            ok: true,
            value: {
                id: "blog",
                title: "Blog",
                template: "site",
                milestone: "2026 Q1",
                area: "app:blog",
            },
        },
    ],
    {},
).projects[0];

const mount = () => {
    if (!VIEW) throw new Error("the fixture project did not assemble");
    return mountSuspended(Summary, { props: { view: VIEW, selected: null, blank: false } });
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowSummary", () => {
    it("counts the tickets filed out of every ticket the blocks need", async () => {
        const text = (await mount()).text();

        expect(text).toContain("0/2 tickets filed");
    });
});
