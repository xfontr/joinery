import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { workScreenshot, workShareImage } from "./workScreenshot.ts";

const WORK_DIR = resolve(import.meta.dirname, "../../../../content/work");

const screenshotOf = (file: string) => ({ screenshot: { file, alt: "", caption: "" } });

const named = readdirSync(WORK_DIR).flatMap((entry) => {
    const file = /^ {2}file: (.+)$/m.exec(readFileSync(resolve(WORK_DIR, entry), "utf8"))?.[1];

    return file ? [[entry, file] as const] : [];
});

describe("workScreenshot", () => {
    it.each(named)(
        "finds the screenshot %s names, so no case study ships an empty image",
        (_, file) => {
            expect(workScreenshot(screenshotOf(file))?.src).toBeTypeOf("string");
        },
    );

    it("answers nothing for an entry with no screenshot or an unknown file", () => {
        expect(workScreenshot({})).toBeUndefined();
        expect(workScreenshot(screenshotOf("nope.jpg"))).toBeUndefined();
    });
});

describe("workShareImage", () => {
    it.each(named)("finds the share image %s names, so its card never goes blank", (_, file) => {
        expect(workShareImage(screenshotOf(file))).toBeTypeOf("string");
    });
});
