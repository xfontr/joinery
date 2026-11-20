import { defineEventHandler } from "h3";
import { projectCard } from "../../../shared/workflows.ts";
import { loadWorkflows } from "../../utils/workflows.ts";

/** Each project folder's workflows, for the tab this layer adds to the catalog's project pages. */
export default defineEventHandler(async () => {
    const { projects } = await loadWorkflows();
    const byArea: Record<
        string,
        { id: string; title: string; to: string; percent: number; done: number; left: number }[]
    > = {};

    for (const view of projects) {
        const card = projectCard(view);
        const rows = byArea[view.project.area] ?? [];
        rows.push({
            id: card.id,
            title: card.title,
            to: `/workflows/${card.id}`,
            percent: card.percent,
            done: view.progress.done,
            left: view.progress.total - view.progress.done,
        });
        byArea[view.project.area] = rows;
    }

    return byArea;
});
