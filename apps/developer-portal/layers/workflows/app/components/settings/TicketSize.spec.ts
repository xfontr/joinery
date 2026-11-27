import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TicketSize from "./TicketSize.vue";

const COUNTS = { block: 10, supervised: 5, fast: 2 };

describe("SettingsTicketSize", () => {
    it("locks the sizes once it can no longer change", async () => {
        const wrapper = await mountSuspended(TicketSize, {
            props: { modelValue: "block", counts: COUNTS, editable: false },
        });

        expect(
            wrapper
                .findAll("input[type='radio']")
                .every((option) => option.attributes("disabled") !== undefined),
        ).toBe(true);
    });
});
