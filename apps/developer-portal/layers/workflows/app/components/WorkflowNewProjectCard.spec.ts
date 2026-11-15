import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WorkflowNewProjectCard from "./WorkflowNewProjectCard.vue";

describe("WorkflowNewProjectCard", () => {
    it("names the link for screen readers, since the card shows only a plus", async () => {
        const wrapper = await mountSuspended(WorkflowNewProjectCard, {
            props: { label: "New project" },
        });
        const link = wrapper.find("a[href='/workflows/new']");

        expect(link.attributes("aria-label")).toBe("New project");
    });
});
