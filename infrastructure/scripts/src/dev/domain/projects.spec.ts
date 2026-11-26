import { describe, expect, it } from "vitest";
import { PROJECT_ROOTS } from "../../shared/domain/layout.ts";
import { findProject, labelFor, matches, rowFor, toProjects, type Runnable } from "./projects.ts";

const RUNNABLE: Runnable[] = [
    { root: "packages", name: "@joinery/ui" },
    { root: "infrastructure", name: "@joinery/translations" },
    { root: "apps", name: "@joinery/developer-portal" },
    { root: "apps", name: "@joinery/huella-legal" },
];

const PROJECTS = toProjects(RUNNABLE);

describe("labelFor", () => {
    it.each([
        ["@joinery/huella-legal", "Huella Legal"],
        ["@joinery/developer-portal", "Developer Portal"],
        ["@joinery/translations", "Translations"],
    ])("turns %j into the picker row %j", (name, expected) => {
        expect(labelFor(name)).toBe(expected);
    });

    it("keeps an acronym upper-case instead of title-casing it", () => {
        expect(labelFor("@joinery/ui")).toBe("UI");
    });
});

describe("toProjects", () => {
    it("drops the scripts package, so the picker can't offer itself", () => {
        expect(toProjects([{ root: "infrastructure", name: "@joinery/scripts" }])).toEqual([]);
    });

    it("puts apps first and the component library last, so the list opens on what a newcomer wants", () => {
        expect(PROJECTS.map(({ label }) => label)).toEqual([
            "Developer Portal",
            "Huella Legal",
            "Translations",
            "UI",
        ]);
    });

    it("orders alphabetically inside a layer, so a graph change can't move rows under someone's fingers", () => {
        const apps = toProjects([
            { root: "apps", name: "@joinery/developer-portal" },
            { root: "apps", name: "@joinery/huella-legal" },
        ]);

        expect(apps.map(({ label }) => label)).toEqual(["Developer Portal", "Huella Legal"]);
    });

    it.each(PROJECT_ROOTS)("ranks %j above a root the layout doesn't declare", (root) => {
        const [first] = toProjects([
            { root: "nowhere", name: "@joinery/aaa" },
            { root, name: "@joinery/zzz" },
        ]);

        expect(first?.name).toBe("@joinery/zzz");
    });
});

describe("findProject", () => {
    it.each([["@joinery/huella-legal"], ["huella-legal"], ["Huella Legal"], ["huella legal"]])(
        "matches %j, so the scoped name isn't the only spelling that works",
        (query) => {
            expect(findProject(PROJECTS, query)?.name).toBe("@joinery/huella-legal");
        },
    );

    it("returns nothing for a partial name rather than guessing which project was meant", () => {
        expect(findProject(PROJECTS, "huella")).toBeUndefined();
    });
});

describe("rowFor", () => {
    it("carries the layer in the row itself, so the grouping is visible without arrowing to it", () => {
        expect(rowFor({ root: "apps", name: "@joinery/huella-legal", label: "Huella Legal" })).toBe(
            "Huella Legal · apps",
        );
    });
});

describe("matches", () => {
    const UI = { root: "packages", name: "@joinery/ui", label: "UI" };

    it.each([["ui"], ["UI"], ["@joinery/u"]])(
        "narrows the list on %j, the way a partial name is typed",
        (search) => {
            expect(matches(UI, search)).toBe(true);
        },
    );

    it("narrows on a layer, so typing `packages` lists what lives there", () => {
        expect(matches(UI, "packages")).toBe(true);
    });

    it("excludes a project nothing in its spellings or layer contains, so the search can reach empty", () => {
        expect(matches(UI, "legal")).toBe(false);
    });
});
