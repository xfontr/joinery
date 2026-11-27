import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { beforeEach, describe, expect, it } from "vitest";
import { useWorkflowEdit, useWorkflows } from "./useWorkflows.ts";

let reads = 0;

const server = (edit: () => unknown) => {
    serveEndpoint("/api/workflows", () => {
        reads += 1;
        return { templates: [], projects: [], problems: [] };
    });
    serveEndpoint("/api/workflows/edit", edit);
};

const edit = async (body: Record<string, unknown>) =>
    (
        await withSetup(async () => {
            clearNuxtData("workflows");
            const editing = useWorkflowEdit();
            await useWorkflows();
            return editing;
        })
    ).value.edit(body);

beforeEach(() => {
    reads = 0;
    useState("toasts").value = [];
});

describe("useWorkflowEdit", () => {
    it("shows the server's reason when it refuses an edit, so a refusal is never silent", async () => {
        server(
            () =>
                new Response(null, {
                    status: 422,
                    statusText: "the ticket size is fixed once a ticket is filed",
                }),
        );

        await expect(edit({ action: "settings" })).resolves.toBe(false);
        expect(useState<{ title: string }[]>("toasts").value).toEqual([
            expect.objectContaining({ title: "the ticket size is fixed once a ticket is filed" }),
        ]);
        expect(reads).toBe(1);
    });

    it("reloads the workflows after a saved edit, so the page shows what was written", async () => {
        server(() => ({ ok: true }));

        await expect(edit({ action: "settings" })).resolves.toBe(true);
        expect(reads).toBe(2);
        expect(useState("toasts").value).toEqual([]);
    });
});
