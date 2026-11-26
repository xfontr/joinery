import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import About from "./About.vue";

const MESSAGES = {
    projectAbout: {
        facts: {
            changelog: "Changelog",
            lines: "Lines covered",
            recent: "Commits, 2 wk",
            specs: "Specs",
            unreleased: "Unreleased",
            version: "Version",
        },
        none: "None",
        relations: {
            dependsOn: "Depends on",
            usedBy: "Used by",
        },
        tags: "Tags",
        title: "About",
        yes: "yes",
    },
};

const UI = {
    name: "@joinery/ui",
    root: "packages/ui",
    tags: ["type:package", "scope:shared"],
    dependsOn: ["@joinery/configs", "@joinery/gone"],
    dependedOnBy: [],
} satisfies ProjectNode;
const CONFIGS = { ...UI, name: "@joinery/configs", root: "packages/configs", dependsOn: [] };

const METRIC = {
    name: "@joinery/ui",
    root: "packages/ui",
    specs: 12,
    commits: 40,
    commitsLastTwoWeeks: 3,
    coverageLinesPct: 91,
    unreleasedCommits: 4,
    currentVersion: "1.2.0",
    hasChangelog: true,
} satisfies ProjectMetrics;

const mount = (props: Partial<{ metric: ProjectMetrics; coveragePct: number | null }> = {}) =>
    mountSuspended(About, {
        props: { project: UI, metric: METRIC, projects: [UI, CONFIGS], coveragePct: 91, ...props },
    });

const fact = (wrapper: VueWrapper, label: string) =>
    wrapper
        .findAll("dl > div")
        .find((row) => row.find("dt").text().startsWith(label))
        ?.find("dd");

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ProjectAbout", () => {
    it("states the metrics, marking unreleased commits as a gain", async () => {
        const wrapper = await mount();

        expect(fact(wrapper, "Version")?.text()).toBe("1.2.0");
        expect(fact(wrapper, "Unreleased")?.text()).toBe("+4");
        expect(fact(wrapper, "Lines covered")?.text()).toBe("91%");
    });

    it("dashes coverage that was never collected instead of drawing a meter", async () => {
        const wrapper = await mount({ coveragePct: null });

        expect(fact(wrapper, "Lines covered")?.text()).toBe("—");
        expect(fact(wrapper, "Lines covered")?.attributes("data-meter")).toBeUndefined();
    });

    it("links a dependency to its page, and one nobody collected to the catalog", async () => {
        const links = (await mount())
            .findAll("a")
            .map((link) => [link.text(), link.attributes("href")]);

        expect(links).toEqual([
            ["@joinery/configs", "/projects/configs"],
            ["@joinery/gone", "/projects"],
        ]);
    });

    it("says a project nothing uses is used by none, rather than leaving the list blank", async () => {
        const usedBy = (await mount())
            .findAll("dl > div")
            .find((row) => row.find("dt").text().startsWith("Used by"));

        expect(usedBy?.find("dd").text()).toBe("None");
    });
});
