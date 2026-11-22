import { describe, expect, it, vi } from "vitest";

const workflows = vi.hoisted(() => ({ loadWorkflows: vi.fn() }));
const h3 = vi.hoisted(() => ({ defineEventHandler: (handler: unknown) => handler }));

vi.mock("../../utils/workflows.ts", () => workflows);
vi.mock("h3", () => h3);

import handler from "./areas.get.ts";

const view = (id: string, area: string, done: number, total: number) => ({
    project: { id, title: `Project ${id}`, area },
    template: { title: "Site" },
    progress: { done, total, percent: Math.round((done / total) * 100) },
});

describe("workflows by area route", () => {
    it("keys each workflow by its area label's folder, with what is done and what is left", async () => {
        workflows.loadWorkflows.mockResolvedValue({
            projects: [
                view("a", "app:huella-legal", 1, 4),
                view("b", "package:ui", 2, 2),
                view("c", "app:huella-legal", 0, 3),
            ],
        });

        await expect(handler({} as never)).resolves.toEqual({
            "huella-legal": [
                { id: "a", title: "Project a", to: "/workflows/a", percent: 25, done: 1, left: 3 },
                { id: "c", title: "Project c", to: "/workflows/c", percent: 0, done: 0, left: 3 },
            ],
            ui: [
                { id: "b", title: "Project b", to: "/workflows/b", percent: 100, done: 2, left: 0 },
            ],
        });
    });
});
