import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Footer from "./Footer.vue";

const MESSAGES = {
    wizardFooter: {
        back: "Back",
        create: "Create project",
        download: "Download YAML",
        next: "Next",
        readOnly: {
            description:
                "This portal is a read-only snapshot. Download the file and add it to data/workflows/projects/{id}.yaml in a pull request.",
            title: "You're not authorised to create projects here",
        },
    },
};

const STEP = { id: "harbour", first: false, last: false, canAdvance: true, editable: true };

const labels = (wrapper: VueWrapper) => wrapper.findAll("button").map((button) => button.text());

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WizardFooter", () => {
    it("offers no Back on the first step", async () => {
        const wrapper = await mountSuspended(Footer, { props: { ...STEP, first: true } });

        expect(labels(wrapper)).toEqual(["Next"]);
    });

    it("holds Next until the step is answered", async () => {
        const wrapper = await mountSuspended(Footer, { props: { ...STEP, canAdvance: false } });

        expect(wrapper.findAll("button")[1]?.attributes("disabled")).toBeDefined();
    });

    it("creates the project on the last step where the portal can write", async () => {
        const wrapper = await mountSuspended(Footer, { props: { ...STEP, last: true } });

        await wrapper.findAll("button")[1]?.trigger("click");

        expect(wrapper.emitted("create")).toHaveLength(1);
    });

    it("offers the file as a download on a read-only portal, naming where it goes", async () => {
        const wrapper = await mountSuspended(Footer, {
            props: { ...STEP, last: true, editable: false },
        });

        await wrapper.findAll("button")[1]?.trigger("click");

        expect(wrapper.emitted("download")).toHaveLength(1);
        expect(wrapper.text()).toContain("data/workflows/projects/harbour.yaml");
    });
});
