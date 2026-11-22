import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Review from "./Review.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const PREVIEW =
    assembleWorkflows(
        [{ file: "site.yaml", ok: true, value: TEMPLATE }],
        [
            {
                file: "blog.yaml",
                ok: true,
                value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
            },
        ],
        {},
    ).projects[0] ?? null;

const ROWS = [{ label: "Title", value: "Harbour Notes" }];

describe("WizardReview", () => {
    it("lists each answer under its label", async () => {
        const wrapper = await mountSuspended(Review, { props: { rows: ROWS, preview: null } });

        expect(wrapper.find("dt").text()).toBe("Title");
        expect(wrapper.find("dd").text()).toBe("Harbour Notes");
    });

    it("maps the blocks only once there is a template to preview", async () => {
        const without = await mountSuspended(Review, { props: { rows: ROWS, preview: null } });
        expect(without.find("section").exists()).toBe(false);

        const withPreview = await mountSuspended(Review, {
            props: { rows: ROWS, preview: PREVIEW },
        });
        expect(withPreview.find("button[aria-label^='Page,']").exists()).toBe(true);
    });

    it("lights a block clicked on the map and lets it go on a second click", async () => {
        const wrapper = await mountSuspended(Review, { props: { rows: ROWS, preview: PREVIEW } });
        const block = wrapper.find("button[aria-label^='Page,']");

        await block.trigger("click");
        expect(block.attributes("aria-pressed")).toBe("true");

        await block.trigger("click");
        expect(block.attributes("aria-pressed")).toBe("false");
    });
});
