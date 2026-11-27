import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Details from "./Details.vue";

const FIELDS = { title: "", summary: "", id: "", milestone: "", area: "" };

describe("WizardDetails", () => {
    it("submits on Enter, so the wizard can move on from the keyboard", async () => {
        const wrapper = await mountSuspended(Details, { props: FIELDS });

        await wrapper.find("form").trigger("submit");

        expect(wrapper.emitted("submit")).toHaveLength(1);
    });
});
