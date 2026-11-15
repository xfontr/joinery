import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { InvariantFinding } from "#layers/snapshot/shared/types/InvariantFinding.ts";
import { auditProblems } from "./audits.ts";
import { decisionProblems } from "./decisions.ts";
import { WORKSPACE_ROOT } from "./paths.ts";
import { runAllowFailure } from "./run.ts";
import { workflowProblems } from "./workflows.ts";

const AUDITS_DIR = "docs/audits";
const DECISIONS_DIR = "docs/decisions";
const WORKFLOWS_DIR = "data/workflows";
const WORKFLOWS_README = "docs/workflows/README.md";

/** Reads `pnpm invariants:check --json`, reporting unparseable output as a finding of its own. */
export const parseGateFindings = (stdout: string): InvariantFinding[] => {
    try {
        const parsed = JSON.parse(stdout.trim().split("\n").at(-1) ?? "") as unknown;
        if (!Array.isArray(parsed)) throw new TypeError("not an array");

        return parsed.map((finding: InvariantFinding) => ({
            id: finding.id,
            title: finding.title,
            detail: finding.detail,
            evidence: finding.evidence,
        }));
    } catch {
        return [
            {
                id: "invariants-gate-unreadable",
                title: "The invariants gate printed something other than its findings",
                detail: "pnpm invariants:check --json did not end with a JSON array.",
                evidence: ["infrastructure/scripts/src/invariants/README.md"],
            },
        ];
    }
};

/** Dated audits only — `README.md` and `TEMPLATE.md` are the furniture around them. */
export const listAuditFiles = async (): Promise<string[]> => {
    const entries = await readdir(resolve(WORKSPACE_ROOT, AUDITS_DIR)).catch(() => [] as string[]);

    return entries
        .filter((entry) => /^\d{4}-.+\.md$/.test(entry))
        .sort((a, b) => a.localeCompare(b));
};

/** A finding whose status doesn't parse still counts as open on the audits page, so this is what says why. */
export const compareAuditShape = (audits: { file: string; source: string }[]): InvariantFinding[] =>
    auditProblems(audits).map(({ file, message }) => ({
        id: "audit-shape-mismatch",
        title: "An audit doesn't match the template",
        detail: `${file}: ${message}.`,
        evidence: [`${AUDITS_DIR}/${file}`, `${AUDITS_DIR}/TEMPLATE.md`],
    }));

/** Dated decisions only — `README.md` and `TEMPLATE.md` are the furniture around them. */
export const listDecisionFiles = async (): Promise<string[]> => {
    const entries = await readdir(resolve(WORKSPACE_ROOT, DECISIONS_DIR)).catch(
        () => [] as string[],
    );

    return entries
        .filter((entry) => /^\d{4}-.+\.md$/.test(entry))
        .sort((a, b) => a.localeCompare(b));
};

export const compareDecisionShape = (
    decisions: { file: string; source: string }[],
): InvariantFinding[] =>
    decisionProblems(decisions).map(({ file, message }) => ({
        id: "decision-shape-mismatch",
        title: "A decision report doesn't match the template",
        detail: `${file}: ${message}.`,
        evidence: [`${DECISIONS_DIR}/${file}`, `${DECISIONS_DIR}/README.md`],
    }));

/** The workflows page renders a broken file as a gap, so this is what says which file and why. */
export const compareWorkflowShape = (
    problems: { file: string; message: string }[],
): InvariantFinding[] =>
    problems.map(({ file, message }) => ({
        id: "workflow-shape-mismatch",
        title: "A workflow file breaks the rules",
        detail: `${file}: ${message}.`,
        evidence: [`${WORKFLOWS_DIR}/${file}`, WORKFLOWS_README],
    }));

export const collectInvariants = async (): Promise<InvariantFinding[]> => {
    const [gate, auditFiles, decisionFiles, workflows] = await Promise.all([
        runAllowFailure("pnpm", ["--silent", "invariants:check", "--json"], WORKSPACE_ROOT),
        listAuditFiles(),
        listDecisionFiles(),
        workflowProblems(resolve(WORKSPACE_ROOT, WORKFLOWS_DIR), WORKSPACE_ROOT),
    ]);

    const audits = await Promise.all(
        auditFiles.map(async (file) => ({
            file,
            source: await readFile(resolve(WORKSPACE_ROOT, AUDITS_DIR, file), "utf8"),
        })),
    );
    const decisions = await Promise.all(
        decisionFiles.map(async (file) => ({
            file,
            source: await readFile(resolve(WORKSPACE_ROOT, DECISIONS_DIR, file), "utf8"),
        })),
    );

    return [
        ...parseGateFindings(gate),
        ...compareAuditShape(audits),
        ...compareDecisionShape(decisions),
        ...compareWorkflowShape(workflows),
    ];
};
