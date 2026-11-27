import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Progress from "./Progress.vue";

const MESSAGES = {
    workflowSummary: {
        done: "{done} of {total} blocks done ({points})",
        points: "{done}/{total} SP",
        unestimated: "{count} unestimated",
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
    return mountSuspended(Progress, { props: { view: VIEW } });
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowProgress", () => {
    it("counts the blocks done with their points beside them", async () => {
        const text = (await mount()).text();

        expect(text).toContain("0 of 2 blocks done (0/0 SP)");
    });
});
