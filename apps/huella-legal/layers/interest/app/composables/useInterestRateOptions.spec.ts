import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { beforeEach, describe, expect, it } from "vitest";
import { useInterestRateOptions } from "./useInterestRateOptions";

const MESSAGES = {
    interestCalculator: {
        rate: {
            options: {
                custom: "custom",
                judicial: "judicial {percent}",
                legal: "legal {percent}",
            },
        },
    },
};

const optionsFor = async (rates: Parameters<typeof useInterestRateOptions>[0]) =>
    (await withSetup(() => useInterestRateOptions(rates))).value;

describe("useInterestRateOptions", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("labels each preset with its percentage in the reader's decimal format", async () => {
        const options = await optionsFor(["legal", "judicial"]);

        expect(options.value).toEqual([
            { value: "legal", label: "legal 3,25" },
            { value: "judicial", label: "judicial 5,25" },
        ]);
    });

    it("gives the custom rate no percentage, since the reader types it", async () => {
        const options = await optionsFor(["legal", "custom"]);

        expect(options.value.at(-1)).toEqual({ value: "custom", label: "custom" });
    });
});
