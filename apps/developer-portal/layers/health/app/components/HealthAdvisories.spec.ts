import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { VulnerabilityAdvisory } from "#layers/snapshot/shared/types/VulnerabilityAdvisory.ts";
import HealthAdvisories from "./HealthAdvisories.vue";

const MESSAGES = {
    common: {
        severity: {
            critical: "critical",
            high: "high",
            low: "low",
            moderate: "moderate",
        },
    },
    healthAdvisories: {
        columns: {
            advisory: "Advisory",
            package: "Package",
            patched: "Patched",
            severity: "Severity",
            via: "Pulled in via",
        },
        meta: "Every finding pnpm audit reports, over the whole workspace lockfile",
        none: "No known vulnerabilities.",
        notCollected: "Not collected.",
        title: "Advisories",
    },
};

const ADVISORY = {
    id: 1,
    title: "ReDoS in minimatch",
    moduleName: "minimatch",
    severity: "high",
    patchedVersions: ">=3.0.5",
    url: "https://github.com/advisories/1",
    paths: [".>glob>minimatch", ".>rimraf>minimatch"],
} satisfies VulnerabilityAdvisory;

const COUNTS = { info: 0, low: 0, moderate: 0, high: 1, critical: 0 };

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("HealthAdvisories", () => {
    it("lists each advisory with its fix and every chain that pulls it in", async () => {
        const wrapper = await mountSuspended(HealthAdvisories, {
            props: { advisories: [ADVISORY], counts: COUNTS },
        });

        const text = wrapper.find("tbody").text();
        expect(text).toContain(">=3.0.5");
        expect(text).toContain(".>glob>minimatch, .>rimraf>minimatch");
    });

    it("tells an audit that never ran from one that found nothing", async () => {
        const never = await mountSuspended(HealthAdvisories, {
            props: { advisories: [], counts: null },
        });
        const clean = await mountSuspended(HealthAdvisories, {
            props: { advisories: [], counts: { ...COUNTS, high: 0 } },
        });

        expect(never.text()).toContain("Not collected.");
        expect(clean.text()).not.toContain("Not collected.");
    });
});
