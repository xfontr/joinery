import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import WorkflowProblems from "./WorkflowProblems.vue";

const MESSAGES = {
    workflowProblems: {
        title: "{count} workflow file problems",
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowProblems", () => {
    it("names each problem's file and message under a count", async () => {
        const wrapper = await mountSuspended(WorkflowProblems, {
            props: { problems: [{ file: "projects/blog.yaml", message: "no milestone" }] },
        });

        expect(wrapper.text()).toContain("1 workflow file problems");
        expect(wrapper.find("li").text()).toBe("projects/blog.yaml: no milestone");
    });

    it("renders nothing when every file reads cleanly", async () => {
        const wrapper = await mountSuspended(WorkflowProblems, { props: { problems: [] } });

        expect(wrapper.text()).toBe("");
    });
});
