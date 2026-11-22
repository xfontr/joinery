import { describe, expect, it } from "vitest";
import { neighbours } from "./neighbours";

const ITEMS = ["first", "middle", "last"];

describe("neighbours", () => {
    it("offers both sides of an item in the middle", () => {
        expect(neighbours(ITEMS, 1)).toEqual({ previous: "first", next: "last" });
    });

    it("offers nothing before the first item or after the last", () => {
        expect(neighbours(ITEMS, 0).previous).toBeNull();
        expect(neighbours(ITEMS, 2).next).toBeNull();
    });

    it("offers no next item for one that isn't listed, rather than the list's first", () => {
        expect(neighbours(ITEMS, -1)).toEqual({ previous: null, next: null });
    });
});
