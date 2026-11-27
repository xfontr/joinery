import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { auditProblems } from "./audits.ts";
import { brokenLinks } from "./brokenLinks.ts";
import { decisionProblems } from "./decisions.ts";
import { WORKSPACE_ROOT } from "./paths.ts";
import { workflowProblems } from "./workflows.ts";

const AUDITS_DIR = "docs/audits";
const DECISIONS_DIR = "docs/decisions";
const WORKFLOWS_DIR = "data/workflows";

/** Dated reports only — `README.md` and `TEMPLATE.md` are the furniture around them. */
const readDated = async (dir: string): Promise<{ file: string; source: string }[]> => {
    const entries = await readdir(resolve(WORKSPACE_ROOT, dir)).catch(() => [] as string[]);
    const files = entries
        .filter((entry) => /^\d{4}-.+\.md$/.test(entry))
        .sort((a, b) => a.localeCompare(b));

    return Promise.all(
        files.map(async (file) => ({
            file,
            source: await readFile(resolve(WORKSPACE_ROOT, dir, file), "utf8"),
        })),
    );
};

const under =
    (dir: string) =>
    ({ file, message }: { file: string; message: string }) => ({
        file: `${dir}/${file}`,
        message,
    });

/** Every broken link and every audit, decision or workflow file that breaks its template. */
export const repoProblems = async (): Promise<{ file: string; message: string }[]> => {
    const [audits, decisions, workflows, links] = await Promise.all([
        readDated(AUDITS_DIR),
        readDated(DECISIONS_DIR),
        workflowProblems(resolve(WORKSPACE_ROOT, WORKFLOWS_DIR), WORKSPACE_ROOT),
        brokenLinks(),
    ]);

    return [
        ...auditProblems(audits).map(under(AUDITS_DIR)),
        ...decisionProblems(decisions).map(under(DECISIONS_DIR)),
        ...workflows.map(under(WORKFLOWS_DIR)),
        ...links,
    ];
};
