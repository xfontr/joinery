import { out } from "../shared/adapters/io.ts";
import { flag, type Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { createLabel, createMilestone, labelNames, milestoneExists } from "./adapters/gh.ts";
import { oneProject, readProject, readTemplate } from "./adapters/files.ts";
import { readMap } from "./domain/filing.ts";
import { setupPlan } from "./domain/setup.ts";

const apply = (plan: ReturnType<typeof setupPlan>, write: boolean): void => {
    const verb = write ? "Created" : "Creates";

    if (plan.milestone !== null) {
        if (write) createMilestone(plan.milestone);
        out.info(`${verb} milestone ${plan.milestone}`);
    }
    for (const label of plan.labels) {
        if (write) createLabel(label);
        out.info(`${verb} label ${label}`);
    }
};

/** Creates a project's milestone and the labels its tickets will carry; a dry run unless `--yes`. */
export const setup = ({ positionals }: Args): void => {
    const id = oneProject(positionals);
    const project = readProject(id);
    const templateId = (project as { template?: unknown } | null)?.template;
    const template = typeof templateId === "string" ? readTemplate(templateId) : null;

    if (!template) throw new ExpectedError(`${id}.yaml names no template that exists.`);

    const map = readMap(template, project);

    if (!map.milestone) throw new ExpectedError(`${id}.yaml has no milestone.`);

    const plan = setupPlan(map, {
        milestone: milestoneExists(map.milestone),
        labels: labelNames(),
    });
    const write = flag("yes");

    if (plan.milestone === null && plan.labels.length === 0) {
        out.success(`${id}: the milestone and every label already exist.`);
        return;
    }

    apply(plan, write);

    if (!write) {
        out.note("Nothing was created. Run it again with --yes to create these.");
        return;
    }

    out.success(`${id}: ready to sync and file.`);
};
