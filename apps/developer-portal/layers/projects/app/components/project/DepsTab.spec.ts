import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";
import DepsTab from "./DepsTab.vue";

const MESSAGES = {
    projectDepsTab: {
        columns: {
            current: "Current",
            latest: "Latest",
            package: "Package",
            wanted: "Wanted",
        },
        current: "Everything is current.",
        deprecated: "deprecated",
        meta: "pnpm outdated · collected {age} · advisories are workspace-wide",
        title: "Outdated dependencies",
    },
};

const OLD = {
    name: "left-pad",
    current: "1.0.0",
    wanted: "1.0.1",
    latest: "2.0.0",
    isDeprecated: true,
    dependents: ["packages/ui"],
} satisfies OutdatedPackage;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ProjectDepsTab", () => {
    it("lists each outdated package's versions and flags a deprecated one", async () => {
        const wrapper = await mountSuspended(DepsTab, { props: { outdated: [OLD], age: "today" } });

        const cells = wrapper.findAll("tbody td").map((cell) => cell.text());
        expect(cells).toEqual(["left-pad deprecated", "1.0.0", "1.0.1", "2.0.0"]);
    });
});
