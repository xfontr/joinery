import { describe, expect, it } from "vitest";
import { emphasis } from "./emphasis.ts";

describe("emphasis", () => {
    it("marks only the words between a pair of markers as bold", () => {
        expect(emphasis("Then came **the scripts**, fast.")).toEqual([
            { text: "Then came ", strong: false },
            { text: "the scripts", strong: true },
            { text: ", fast.", strong: false },
        ]);
    });

    it("leaves copy with no markers as one plain run", () => {
        expect(emphasis("Takes the next ticket.")).toEqual([
            { text: "Takes the next ticket.", strong: false },
        ]);
    });
});
