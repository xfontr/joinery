import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Summary from "./Summary.vue";

const ESTIMATE = {
    template: "Website",
    title: "",
    blocks: 17,
    tickets: { block: 17, supervised: 8, fast: 3 },
    points: 40,
    receipt: [],
};

const figures = async (ticketSize: "block" | "fast") =>
    (await mountSuspended(Summary, { props: { ...ESTIMATE, ticketSize } }))
        .findAll(".tabular-nums > div")
        .map((figure) => figure.find("p").text());

describe("WizardSummary", () => {
    it("counts the tickets for the size picked", async () => {
        expect(await figures("block")).toEqual(["17", "17", "40"]);
        expect(await figures("fast")).toEqual(["17", "3", "40"]);
    });

    it("reports a ticket size picked in the side panel", async () => {
        const wrapper = await mountSuspended(Summary, {
            props: { ...ESTIMATE, ticketSize: "block" },
        });

        await wrapper.findAll("input[type='radio']")[2]?.setValue();

        expect(wrapper.emitted("update:ticketSize")).toEqual([["fast"]]);
    });
});
