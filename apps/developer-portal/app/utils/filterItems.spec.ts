import { describe, expect, it } from "vitest";
import { filterItems } from "./filterItems.ts";

describe("filterItems", () => {
    it("puts the catch-all first, so clearing a filter is always the top option", () => {
        expect(filterItems("Every state", ["open", "closed"])[0]).toEqual({
            label: "Every state",
            value: "all",
        });
    });

    it("labels each value with the given wording while keeping the raw value to filter by", () => {
        expect(filterItems("Every state", ["open"], (value) => `State ${value}`)[1]).toEqual({
            label: "State open",
            value: "open",
        });
    });

    it("shows a value as it is when no wording is given, as for scopes and labels", () => {
        expect(filterItems("Every scope", ["@monorepo/ui"])[1]?.label).toBe("@monorepo/ui");
    });
});
