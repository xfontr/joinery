import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readWorkflowFiles } from "#layers/workflows/server/utils/workflowFiles.ts";
import {
    assembleWorkflows,
    type Template,
    type WorkflowProblem,
} from "#layers/workflows/shared/workflows.ts";

/** Paths a capability's `reuse.from` points at that don't exist, relative to the workspace root. */
const missingReusePaths = (templates: Template[], workspaceRoot: string): WorkflowProblem[] =>
    templates.flatMap((template) =>
        [...template.capabilities, ...template.types].flatMap((capability) => {
            const from = capability.reuse?.from;

            if (!from || existsSync(resolve(workspaceRoot, from))) return [];

            return [
                {
                    file: `templates/${template.id}.yaml`,
                    message: `capability \`${capability.id}\` reuses \`${from}\`, which doesn't exist`,
                },
            ];
        }),
    );

/** Every project file with no `<id>.diary.md` beside it. */
export const missingDiaries = (projectFiles: string[], dir: string): WorkflowProblem[] =>
    projectFiles
        .map((file) => file.replace(/\.yaml$/, ""))
        .filter((id) => !existsSync(resolve(dir, "projects", `${id}.diary.md`)))
        .map((id) => ({
            file: `projects/${id}.yaml`,
            message: `${id} has no \`${id}.diary.md\` beside it`,
        }));

/** Every rule `docs/workflows/README.md` states, plus the ones only a filesystem can check. */
export const workflowProblems = async (
    dir: string,
    workspaceRoot: string,
): Promise<WorkflowProblem[]> => {
    const files = await readWorkflowFiles(dir);
    const { templates, problems } = assembleWorkflows(
        files.templates,
        files.projects,
        files.snapshots,
    );

    return [
        ...problems,
        ...missingReusePaths(templates, workspaceRoot),
        ...missingDiaries(
            files.projects.map(({ file }) => file),
            dir,
        ),
    ];
};
