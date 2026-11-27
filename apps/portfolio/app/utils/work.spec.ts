import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { toWork, toWorkCase, type WorkRow } from "./work.ts";

const WORK_DIR = resolve(import.meta.dirname, "../../content/work");
const SCREENSHOT_DIR = resolve(import.meta.dirname, "../assets/work");

const TOOL = {
    path: "/work/wp-editor",
    name: "WP Editor",
    kind: "Editing tool",
    stage: "In use",
    line: "A tool.",
    caseStudy: false,
    live: { href: "/wiki/apps/wp-editor/readme", label: "Read the docs" },
} satisfies WorkRow;

const STUDY = {
    ...TOOL,
    path: "/work/huella-legal",
    caseStudy: true,
    title: "Huella",
    mark: "Legal",
    facts: ["105 articles"],
    screenshot: { file: "huella-legal.jpg", alt: "Home", caption: "On staging." },
    why: "Why it exists.",
    countedOn: "29 Sep 2026",
    design: [{ label: "Paper", value: "Ivory" }],
    decisions: [{ id: "0028-urls", question: "Will links work?", answer: "Yes." }],
};

const files = readdirSync(WORK_DIR).map((file) => {
    const [, frontmatter = ""] =
        /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(resolve(WORK_DIR, file), "utf8")) ?? [];

    return [file, { path: `/work/${file.replace(/\.md$/, "")}`, ...parse(frontmatter) }] as const;
});

describe("toWork", () => {
    it("keeps only the fields it lists, so a content row's extras never leak into the page", () => {
        const work = toWork({ ...STUDY, order: 1, body: { type: "root" } } as WorkRow);

        expect(Object.keys(work)).not.toContain("order");
        expect(Object.keys(work)).not.toContain("body");
        expect(Object.keys(work)).not.toContain("why");
    });

    it("lists an entry that claims a study but lacks its screenshot as a tool", () => {
        expect(toWork({ ...STUDY, screenshot: undefined }).caseStudy).toBe(false);
    });
});

describe("toWorkCase", () => {
    it("answers nothing for a missing entry and for a tool", () => {
        expect(toWorkCase(null)).toBeNull();
        expect(toWorkCase(TOOL)).toBeNull();
    });

    it.each(["why", "countedOn", "design", "decisions"] as const)(
        "answers nothing when a study lacks %s, so the page reads as missing",
        (field) => {
            expect(toWorkCase({ ...STUDY, [field]: undefined })).toBeNull();
        },
    );

    it("carries every field the study page prints", () => {
        expect(toWorkCase(STUDY)).toMatchObject({
            slug: "huella-legal",
            why: STUDY.why,
            decisions: STUDY.decisions,
        });
    });
});

describe("content/work", () => {
    const studies = files.filter(([, row]) => row.caseStudy === true);

    it.each(studies)("%s carries every field its study page prints", (_, row) => {
        expect(toWorkCase(row)).not.toBeNull();
    });

    it.each(studies)("%s names a screenshot that exists", (_, row) => {
        expect(existsSync(resolve(SCREENSHOT_DIR, row.screenshot.file))).toBe(true);
    });
});
