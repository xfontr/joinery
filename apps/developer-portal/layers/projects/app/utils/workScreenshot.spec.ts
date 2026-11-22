import { describe, expect, it } from "vitest";
import { WORK } from "../../shared/work.ts";
import { workScreenshot } from "./workScreenshot.ts";

describe("workScreenshot", () => {
    it.each(WORK.map((work) => [work.slug, work] as const))(
        "finds the screenshot %s names, so no case study ships an empty image",
        (_, work) => {
            expect(workScreenshot(work)).toBeTypeOf("string");
        },
    );
});
