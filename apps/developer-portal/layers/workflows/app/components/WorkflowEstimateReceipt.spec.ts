import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ReceiptRow } from "#layers/workflows/shared/workflows.ts";
import WorkflowEstimateReceipt from "./WorkflowEstimateReceipt.vue";

const row = (id: string, points: number, detail: string | null = null): ReceiptRow => ({
    id,
    label: id,
    detail,
    points,
    nested: false,
});

describe("WorkflowEstimateReceipt", () => {
    it("adds every line after the first and prices each in story points", async () => {
        const wrapper = await mountSuspended(WorkflowEstimateReceipt, {
            props: { rows: [row("Core", 20), row("Blog", 8, "Comments")], total: 28 },
        });

        const lines = wrapper.findAll("li").map((line) => line.text());
        expect(lines[0]).toMatch(/^Core\s*20 SP$/);
        expect(lines[1]).toMatch(/^\+ Blog · Comments\s*8 SP$/);
        expect(wrapper.find("p:last-child").text()).toMatch(/28 SP$/);
    });
});
