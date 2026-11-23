import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ProjectRow } from "#layers/projects/app/types/ProjectRow.ts";
import ProjectsTable from "./ProjectsTable.vue";

const ROW = {
    name: "@joinery/ui",
    root: "packages/ui",
    to: "/projects/ui",
    kind: "packages",
    description: "",
    version: null,
    unreleased: 3,
    recent: null,
    specs: 8,
    lines: 72,
    linesLabel: "72%",
    tone: "tone-warn",
    usedBy: 2,
    compact: "",
} satisfies ProjectRow;

const GROUPS = [{ id: "packages", label: "Packages", rows: [ROW] }];

describe("ProjectsTable", () => {
    it("shows a project's figures, a dash for what is missing and unreleased commits as a gain", async () => {
        const wrapper = await mountSuspended(ProjectsTable, {
            props: { groups: GROUPS, headed: false },
        });

        const cells = wrapper.findAll("tbody td").map((cell) => cell.text());
        expect(cells.slice(1)).toEqual(["—", "+3", "—", "8", "72%", "2"]);
    });

    it("heads each group only on the unfiltered list", async () => {
        const headed = await mountSuspended(ProjectsTable, {
            props: { groups: GROUPS, headed: true },
        });
        expect(headed.find("tbody th").text()).toMatch(/Packages\s*1/);

        const filtered = await mountSuspended(ProjectsTable, {
            props: { groups: GROUPS, headed: false },
        });
        expect(filtered.find("tbody th").exists()).toBe(false);
    });

    it("says why the table is empty in the words the page hands it", async () => {
        const wrapper = await mountSuspended(ProjectsTable, {
            props: { groups: [], headed: true },
            slots: { empty: () => "Placeholder empty line" },
        });

        expect(wrapper.text()).toContain("Placeholder empty line");
    });
});
