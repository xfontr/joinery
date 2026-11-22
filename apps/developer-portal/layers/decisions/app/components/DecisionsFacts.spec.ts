import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";
import DecisionsFacts from "./DecisionsFacts.vue";

const report = (id: string, status: DecisionReport["status"]): DecisionReport => ({
    path: `docs/decisions/${id}.md`,
    id,
    number: id,
    title: id,
    status,
    decision: "accepted",
    supersededBy: null,
    updatedAt: null,
    words: 0,
});

describe("DecisionsFacts", () => {
    it("counts the reports and each status", async () => {
        const wrapper = await mountSuspended(DecisionsFacts, {
            props: {
                reports: [
                    report("1", "implemented"),
                    report("2", "implemented"),
                    report("3", "to-implement"),
                ],
            },
        });

        expect(wrapper.findAll("[data-figure]").map((value) => value.text())).toEqual([
            "3",
            "1",
            "2",
            "0",
        ]);
    });
});
