import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";
import HealthOutdated from "./HealthOutdated.vue";

const MESSAGES = {
    healthOutdated: {
        columns: {
            current: "Current",
            latest: "Latest",
            package: "Package",
            projects: "Projects",
            usedBy: "Used by",
            wanted: "Wanted",
        },
        meta: "pnpm outdated -r · wanted is what the range in package.json already allows",
        notCollected: "Not collected.",
        title: "Outdated",
        upToDate: "Everything is on its wanted version.",
    },
};

const OLD = {
    name: "left-pad",
    current: "1.0.0",
    wanted: "1.0.1",
    latest: "2.0.0",
    isDeprecated: false,
    dependents: ["packages/ui", "apps/blog"],
} satisfies OutdatedPackage;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("HealthOutdated", () => {
    it("lists every project that uses an outdated package", async () => {
        const wrapper = await mountSuspended(HealthOutdated, { props: { outdated: [OLD] } });

        expect(wrapper.find("tbody").text()).toContain("packages/ui, apps/blog");
    });

    it("tells an outdated check that never ran from one that found nothing", async () => {
        const never = await mountSuspended(HealthOutdated, { props: { outdated: null } });
        const clean = await mountSuspended(HealthOutdated, { props: { outdated: [] } });

        expect(never.text()).toContain("Not collected.");
        expect(clean.text()).not.toContain("Not collected.");
    });
});
