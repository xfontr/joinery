import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { QueueKind } from "~/types/QueueKind";
import type { QueueRow } from "~/types/QueueRow";
import WorkQueue from "./WorkQueue.vue";

const row = (key: string, to = `/decisions/${key}`): QueueRow => ({
    key,
    id: key,
    title: `Title ${key}`,
    meta: "meta",
    to,
});

const rows = (overrides: Partial<Record<QueueKind, QueueRow[]>> = {}) => ({
    issues: [],
    decisions: [],
    audits: [],
    releases: [],
    ...overrides,
});

const open = (props: Partial<InstanceType<typeof WorkQueue>["$props"]> = {}) =>
    mountSuspended(WorkQueue, {
        props: { rows: rows(), issuesRead: true, issuesError: false, ...props },
    });

describe("WorkQueue", () => {
    it("shows eight rows and links the rest from the kind's own page", async () => {
        const decisions = Array.from({ length: 10 }, (_, index) => row(`d${index}`));
        const wrapper = await open({ rows: rows({ decisions }) });

        await wrapper.findComponent({ name: "UTabs" }).setValue("decisions");

        expect(wrapper.findAll("li")).toHaveLength(8);
        expect(wrapper.find('a[href="/decisions"]').text()).toContain("workQueue.all");
    });

    it("leaves the issue count blank until GitHub has answered", async () => {
        const wrapper = await open({ issuesRead: false });

        const tabs = wrapper.findComponent({ name: "UTabs" }).props("items") as {
            badge?: number;
        }[];
        expect(tabs[0]?.badge).toBeUndefined();
        expect(tabs[1]?.badge).toBe(0);
    });

    it("opens on issues and says they're still loading rather than that none are open", async () => {
        const wrapper = await open({ issuesRead: false });

        expect(wrapper.text()).toContain("workQueue.reading");
        expect(wrapper.text()).not.toContain("workQueue.empty");
    });

    it("says GitHub couldn't be read rather than that nothing is open", async () => {
        const wrapper = await open({ issuesError: true });

        await wrapper.findComponent({ name: "UTabs" }).setValue("issues");

        expect(wrapper.text()).toContain("workQueue.githubError");
    });
});
