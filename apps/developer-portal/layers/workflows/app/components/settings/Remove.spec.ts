import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import type { SnapshotIssue } from "#layers/workflows/shared/workflows.ts";
import Remove from "./Remove.vue";

const MESSAGES = {
    settingsRemove: {
        cancel: "Cancel",
        confirm: "Type {project} to confirm",
        delete: "Delete project",
        deleteOpen: "Delete project…",
        drop: "As of the last sync, {close} tickets are untouched and {keep} already started or closed. Close the untouched ones first with {command}, since it reads the milestone from this project file.",
        lead: "Removes the project file and its snapshot. Run {command} first to close the tickets nobody started; the rest stay on GitHub.",
        modal: {
            description: "The project file and its snapshot go. Deleting closes nothing on GitHub.",
            title: "Delete {title}?",
        },
        rarely: "Rarely needed.",
        title: "Remove",
    },
};

const ticket = (number: number, overrides: Partial<SnapshotIssue> = {}): SnapshotIssue => ({
    number,
    title: `Ticket ${number}`,
    url: "",
    state: "open",
    reason: null,
    caps: [],
    createdAt: null,
    closedAt: null,
    activity: [],
    blockedBy: [],
    branch: false,
    pr: false,
    owner: false,
    complexity: null,
    ...overrides,
});

const dialog = () => document.body.querySelector<HTMLElement>("[role=dialog]");
const deleteButton = () =>
    [...(dialog()?.querySelectorAll("button") ?? [])].find(
        (button) => button.textContent?.trim() === "Delete project",
    );

const open = async (issues: SnapshotIssue[] = []) => {
    const wrapper = await mountSuspended(Remove, {
        props: { project: "blog", title: "Blog", issues },
    });
    await wrapper.find("button").trigger("click");
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("SettingsRemove", () => {
    it("deletes only once the project's id is typed back", async () => {
        const wrapper = await open();

        expect(deleteButton()?.disabled).toBe(true);

        const input = dialog()?.querySelector("input");
        if (!input) throw new Error("no confirmation field");
        input.value = "blog";
        input.dispatchEvent(new Event("input"));
        await flushPromises();
        deleteButton()?.click();

        expect(wrapper.emitted("remove")).toHaveLength(1);
    });

    it("counts the untouched tickets workflow:drop would close before deleting", async () => {
        await open([ticket(1), ticket(2, { branch: true })]);

        expect(dialog()?.textContent).toMatch(/1 tickets are untouched and\s+1 already started/);
    });
});
