import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import Alerts from "./Alerts.vue";

const MESSAGES = {
    workflowAlerts: {
        blank: {
            description:
                "Ask Claude to draft its map: it asks what the project is, writes the blocks under {extras} in {file}, and they show here for you to check before anything is filed.",
            title: "This project has no blocks yet",
        },
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowAlerts", () => {
    it("says nothing for a project with blocks", async () => {
        const wrapper = await mountSuspended(Alerts, {
            props: { project: "blog", blank: false },
        });

        expect(wrapper.text()).toBe("");
    });

    it("points a blank project at the file its blocks go in", async () => {
        const wrapper = await mountSuspended(Alerts, {
            props: { project: "blog", blank: true },
        });

        expect(wrapper.text()).toContain("data/workflows/projects/blog.yaml");
    });
});
