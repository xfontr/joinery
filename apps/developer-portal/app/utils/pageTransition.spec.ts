import { describe, expect, it } from "vitest";
import { pageTransitionOf } from "./pageTransition.ts";

describe("pageTransitionOf", () => {
    it.each([
        { from: "visitor", to: "visitor", kind: "visitor" },
        { from: undefined, to: undefined, kind: "dev" },
        { from: "visitor", to: undefined, kind: "mode" },
        { from: undefined, to: "visitor", kind: "mode" },
    ])("animates $from → $to as $kind", ({ from, to, kind }) => {
        expect(pageTransitionOf(from, to)).toBe(kind);
    });
});
