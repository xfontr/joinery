import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SnapshotAge from "./SnapshotAge.vue";
import type { Manifest } from "#layers/snapshot/shared/types/Manifest.ts";

const manifest: Manifest = {
    schemaVersion: 1,
    generatedAt: "2026-09-20T10:00:00.000Z",
    commit: "abc1234",
    branch: "master",
    artifacts: {
        docs: { generatedAt: "2026-09-20T11:00:00.000Z", ok: true },
        coverage: { generatedAt: "2026-09-20T09:00:00.000Z", ok: false, error: "pnpm test failed" },
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", {
        snapshotAge: {
            at: "At {commit} on {branch}",
            collected: "Collected {age}",
            failed: "{artifact} failed to collect: {error}",
            never: "Never collected",
        },
    });
});

afterEach(() => vi.useRealTimers());

describe("SnapshotAge", () => {
    it("explains that collection has never happened when the manifest is absent", async () => {
        const wrapper = await mountSuspended(SnapshotAge, { props: { manifest: null } });

        expect(wrapper.text()).toContain("Never collected");
    });

    it("shows the requested artifact failure and warning state", async () => {
        const wrapper = await mountSuspended(SnapshotAge, {
            props: { manifest, artifact: "coverage" },
        });

        expect(wrapper.text()).toContain("coverage failed to collect: pnpm test failed");
        expect(wrapper.find(".tone-bad").exists()).toBe(true);
    });

    it("shows only the age, keeping commit and branch for the hover title", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));
        const wrapper = await mountSuspended(SnapshotAge, {
            props: { manifest, artifact: "docs" },
        });

        expect(wrapper.text()).toContain("Collected 1 hour ago");
        expect(wrapper.text()).not.toContain("abc1234");
        expect(wrapper.find("[title]").attributes("title")).toBe("At abc1234 on master");
    });

    it("falls back to the manifest timestamp when no artifact status exists", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));
        const wrapper = await mountSuspended(SnapshotAge, {
            props: { manifest, artifact: "missing" },
        });

        expect(wrapper.text()).toContain("2 hours ago");
    });
});
