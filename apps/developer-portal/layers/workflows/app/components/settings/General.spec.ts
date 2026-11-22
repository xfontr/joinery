import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import General from "./General.vue";

const FIELDS = {
    title: "Blog",
    summary: "",
    milestone: "Blog",
    area: "app:blog",
    template: "Website",
};

describe("SettingsGeneral", () => {
    it("locks every field on a read-only portal", async () => {
        const wrapper = await mountSuspended(General, { props: { ...FIELDS, editable: false } });

        const fields = [...wrapper.findAll("input"), ...wrapper.findAll("textarea")];
        expect(fields.every((field) => field.attributes("disabled") !== undefined)).toBe(true);
    });

    it("reports an edit under the field's own model", async () => {
        const wrapper = await mountSuspended(General, { props: { ...FIELDS, editable: true } });

        await wrapper.findAll("input")[1]?.setValue("Blog v2");

        expect(wrapper.emitted("update:milestone")).toEqual([["Blog v2"]]);
    });

    it("names the template, which can't change", async () => {
        const wrapper = await mountSuspended(General, { props: { ...FIELDS, editable: true } });

        expect(wrapper.text()).toContain("Website");
    });
});
