import { describe, expect, it } from "vitest";
import type { NavLink } from "../types/NavLink.ts";
import { appEntries } from "./apps.ts";
import { searchGroups, type SearchSection } from "./search.ts";

const link = (to: string): NavLink => ({ icon: "i-lucide-circle", to });
const t = (key: string): string => key;

const NAV = {
    overview: link("/"),
    docs: link("/wiki"),
    decisions: link("/decisions"),
    audits: link("/audits"),
    benchmarks: link("/benchmarks"),
};

const page = (path: string, title: string): SearchSection => ({
    id: path,
    title,
    titles: [],
    level: 1,
    content: "",
});

const heading = (path: string, anchor: string, title: string, titles: string[]) =>
    ({
        id: `${path}#${anchor}`,
        title,
        titles,
        level: titles.length + 1,
        content: "",
    }) satisfies SearchSection;

const SECTIONS = [
    page("/docs/decisions/0036-ui", "0036 Drop the UI kit"),
    heading("/docs/decisions/0036-ui", "drop-the-ui-kit", "0036 Drop the UI kit", []),
    heading("/docs/decisions/0036-ui", "context", "Context", ["0036 Drop the UI kit"]),
    page("/docs/audits/2026-09-25-portal", "Portal audit"),
    page("/docs/benchmarks/rauno-me", "rauno.me"),
    page("/docs/benchmarks/readme", "Benchmarks"),
    page("/docs/decisions/readme", "Decisions"),
];

const groupsOf = (nav: Record<string, NavLink | undefined>) =>
    searchGroups(appEntries(nav, t), SECTIONS, t);

/** Each group as its label and the destinations it offers, in order. */
const destinations = (nav: Record<string, NavLink | undefined> = NAV) =>
    groupsOf(nav).map((group) => [group.label, group.items?.map((item) => item.to)]);

describe("searchGroups", () => {
    it("offers every page in the rail, so a page is reachable by its name", () => {
        const [pages] = groupsOf(NAV);

        expect(pages?.items?.map((item) => [item.label, item.to])).toEqual([
            ["app.nav.overview", "/"],
            ["app.nav.docs", "/wiki"],
            ["app.nav.decisions", "/decisions"],
            ["app.nav.audits", "/audits"],
            ["app.nav.benchmarks", "/benchmarks"],
        ]);
    });

    it("sends each record to the page that renders it, and its folder's README to the wiki", () => {
        expect(destinations()).toEqual([
            ["app.search.pages", ["/", "/wiki", "/decisions", "/audits", "/benchmarks"]],
            ["app.nav.decisions", ["/decisions/0036-ui", "/decisions/0036-ui#context"]],
            ["app.nav.audits", ["/audits/2026-09-25-portal"]],
            ["app.nav.benchmarks", ["/benchmarks/rauno-me"]],
            ["app.search.wiki", ["/wiki/docs/benchmarks/readme", "/wiki/docs/decisions/readme"]],
        ]);
    });

    it("leaves a record to the wiki when the layer that renders it is switched off", () => {
        expect(destinations({ ...NAV, decisions: undefined }).at(-1)).toEqual([
            "app.search.wiki",
            [
                "/wiki/docs/decisions/0036-ui",
                "/wiki/docs/decisions/0036-ui#context",
                "/wiki/docs/benchmarks/readme",
                "/wiki/docs/decisions/readme",
            ],
        ]);
    });

    it("names the doc a heading sits in, so two docs' identical headings tell apart", () => {
        const decisions = groupsOf(NAV).find((group) => group.id === "decisions");

        expect(decisions?.items?.map((item) => [item.prefix, item.label])).toEqual([
            [undefined, "0036 Drop the UI kit"],
            ["0036 Drop the UI kit ›", "Context"],
        ]);
    });
});
