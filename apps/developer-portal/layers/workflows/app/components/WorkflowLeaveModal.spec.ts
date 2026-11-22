import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import WorkflowLeaveModal from "./WorkflowLeaveModal.vue";

const MESSAGES = {
    workflowLeaveModal: {
        stay: "Stay",
    },
};

const press = async (label: string) => {
    [...document.body.querySelectorAll<HTMLButtonElement>("[role=dialog] button")]
        .find((candidate) => candidate.textContent?.trim() === label)
        ?.click();
    await flushPromises();
};

const mount = () =>
    mountSuspended(WorkflowLeaveModal, {
        props: { open: true, title: "Leave?", description: "Unsaved", action: "Leave anyway" },
    });

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowLeaveModal", () => {
    it("leaves only through the button that says so", async () => {
        const wrapper = await mount();

        await press("Leave anyway");

        expect(wrapper.emitted("leave")).toHaveLength(1);
    });

    it("closes without leaving on Stay", async () => {
        const wrapper = await mount();

        await press("Stay");

        expect(wrapper.emitted("leave")).toBeUndefined();
        expect(wrapper.emitted("update:open")).toEqual([[false]]);
    });
});
