import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Details from "./Details.vue";

const FIELDS = { title: "", summary: "", id: "", milestone: "", area: "" };

describe("WizardDetails", () => {
    it("reports each field typed under its own model", async () => {
        const wrapper = await mountSuspended(Details, { props: FIELDS });
        const inputs = wrapper.findAll("input");

        await inputs[0]?.setValue("Harbour Notes");
        await inputs[2]?.setValue("2026 Q1");

        expect(wrapper.emitted("update:title")).toEqual([["Harbour Notes"]]);
        expect(wrapper.emitted("update:milestone")).toEqual([["2026 Q1"]]);
    });

    it("shows the id and milestone errors it is handed", async () => {
        const wrapper = await mountSuspended(Details, {
            props: {
                ...FIELDS,
                idError: "Bad id: placeholder",
                milestoneError: "Taken: placeholder",
            },
        });

        expect(wrapper.text()).toContain("Bad id: placeholder");
        expect(wrapper.text()).toContain("Taken: placeholder");
    });

    it("submits on Enter, so the wizard can move on from the keyboard", async () => {
        const wrapper = await mountSuspended(Details, { props: FIELDS });

        await wrapper.find("form").trigger("submit");

        expect(wrapper.emitted("submit")).toHaveLength(1);
    });
});
