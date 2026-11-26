import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Step from "./Step.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const { templates } = assembleWorkflows(
    [
        { file: "site.yaml", ok: true, value: TEMPLATE },
        { file: "shop.yaml", ok: true, value: { ...TEMPLATE, id: "shop", title: "Shop" } },
    ],
    [],
    {},
);

const props = (id: string) => ({
    step: { id, question: "Placeholder question", hint: "Placeholder hint" },
    templates,
    templateId: "site",
    template: templates[0],
    features: [],
    pageErrors: [],
    review: [{ label: "Title", value: "Harbour" }],
    preview: null,
    title: "",
    summary: "",
    id: "",
    milestone: "",
    area: "",
    pages: [],
});

describe("WizardStep", () => {
    it("asks the step's question", async () => {
        const wrapper = await mountSuspended(Step, { props: props("details") });

        expect(wrapper.find("h2").text()).toBe("Placeholder question");
    });

    it("shows the template picker on the first step and reports the template picked", async () => {
        const wrapper = await mountSuspended(Step, { props: props("template") });

        await wrapper.findAll("input[type='radio']")[1]?.setValue();

        expect(wrapper.emitted("pickTemplate")).toEqual([["shop"]]);
    });

    it("shows the details form on the details step and the answers on review", async () => {
        const details = await mountSuspended(Step, { props: props("details") });
        expect(details.find("form").exists()).toBe(true);

        const review = await mountSuspended(Step, { props: props("review") });
        expect(review.find("dd").text()).toBe("Harbour");
    });
});
