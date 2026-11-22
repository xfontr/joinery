import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import WorkflowTicketSizePicker from "./WorkflowTicketSizePicker.vue";

const MESSAGES = {
    ticketSize: {
        block: {
            summary: "One ticket per block, or its suggested ones, each PR reviewed by hand",
            title: "Reviewed",
        },
        fast: {
            summary: "Tickets of up to {width} SP, and the spikes together; sign-offs stay apart",
            title: "Fast",
            warning:
                "Meant for AI-run projects, putting speed over code quality: for internal tools and experiments.",
        },
        supervised: {
            summary:
                "A stage's build blocks share tickets of up to {width} SP; spikes and sign-offs stay apart",
            title: "Supervised",
        },
    },
    workflowTicketSizePicker: {
        legend: "Ticket size",
        tickets: "tickets | ticket | tickets",
    },
};

const mount = () =>
    mountSuspended(WorkflowTicketSizePicker, {
        props: {
            modelValue: "block",
            counts: { block: 17, supervised: 8, fast: 7 },
            editable: true,
        },
    });

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowTicketSizePicker", () => {
    it("prices every size in tickets, so the choice is made on the number", async () => {
        const options = (await mount()).findAll("label").map((option) => option.text());

        expect(options[0]).toMatch(/^17\s*tickets/);
        expect(options[2]).toMatch(/^7\s*tickets/);
    });

    it("shows no ticket count when given none, as settings does once the size is chosen", async () => {
        const wrapper = await mountSuspended(WorkflowTicketSizePicker, {
            props: { modelValue: "block" },
        });

        const options = wrapper.findAll("label").map((option) => option.text());

        expect(options[0]).toMatch(/^Reviewed/);
        expect(options[2]).toMatch(/^Fast/);
    });

    it("warns that a size bundling blocks is for AI-run projects, and stays quiet for one per block", async () => {
        expect((await mount()).text()).not.toContain("Meant for AI-run projects");

        const wrapper = await mountSuspended(WorkflowTicketSizePicker, {
            props: { modelValue: "fast" },
        });
        expect(wrapper.text()).toContain("Meant for AI-run projects");
    });

    it("marks only the current size as chosen and reports the one clicked", async () => {
        const wrapper = await mount();
        const options = wrapper.findAll<HTMLInputElement>("input[type='radio']");

        expect(options.map((option) => option.element.checked)).toEqual([true, false, false]);

        await options[1]?.setValue();
        expect(wrapper.emitted("update:modelValue")).toEqual([["supervised"]]);
    });
});
