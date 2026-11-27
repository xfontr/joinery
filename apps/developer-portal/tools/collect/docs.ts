import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { AuditMeta } from "#layers/snapshot/shared/types/AuditMeta.ts";
import type { DecisionOutcome, DecisionStatus } from "#layers/snapshot/shared/decisions.ts";
import type { DocKind } from "#layers/snapshot/shared/types/DocKind.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import { parseFindings } from "#layers/snapshot/shared/audits.ts";
import { DECISION_OUTCOMES, DECISION_STATUSES } from "#layers/snapshot/shared/decisions.ts";
import { frontmatterFields } from "../lib/decisions.ts";
import { WORKSPACE_ROOT } from "../lib/paths.ts";
import { git } from "../lib/run.ts";

const HEADING = /^#{1,3}[^\S\n]+\S.*$/gm;

const DECISION_PATH = /^docs\/decisions\/\d{4}-/;
const AUDIT_PATH = /^docs\/audits\/\d{4}-/;

const exists = async (path: string): Promise<boolean> => {
    try {
        await access(path);

        return true;
    } catch {
        return false;
    }
};

const kindOf = (path: string): DocKind => {
    if (DECISION_PATH.test(path)) return "decision";
    if (AUDIT_PATH.test(path)) return "audit";
    if (path.endsWith("CHANGELOG.md")) return "changelog";
    if (path.endsWith("CLAUDE.md")) return "agent";
    if (path.endsWith("SKILL.md")) return "skill";
    if (path.startsWith("docs/")) return "doc";

    return "readme";
};

interface DecisionMeta {
    status: DecisionStatus | null;
    decision: DecisionOutcome | null;
    supersededBy: string | null;
}

const NO_DECISION_META: DecisionMeta = { status: null, decision: null, supersededBy: null };

/**
 * An unrecognised `status`/`decision` value answers null instead of a guess, so a frontmatter typo
 * shows as a missing badge in the dashboard.
 */
export const decisionMetaOf = (path: string, source: string): DecisionMeta => {
    if (!DECISION_PATH.test(path)) return NO_DECISION_META;

    const fields = frontmatterFields(source);

    if (fields === null) return NO_DECISION_META;

    const status = (DECISION_STATUSES as readonly string[]).includes(fields.status ?? "")
        ? (fields.status as DecisionStatus)
        : null;
    const decision = (DECISION_OUTCOMES as readonly string[]).includes(fields.decision ?? "")
        ? (fields.decision as DecisionOutcome)
        : null;

    return {
        status,
        decision,
        supersededBy: decision === "superseded" ? (fields.supersededBy ?? null) : null,
    };
};

const auditMetaOf = (path: string, source: string): AuditMeta | null => {
    if (!AUDIT_PATH.test(path)) return null;

    const fields = frontmatterFields(source) ?? {};

    return {
        scope: fields.scope ?? null,
        commit: fields.commit ?? null,
        findings: parseFindings(source),
    };
};

export const collectDocs = async (generatedAt: string): Promise<DocsArtifact> => {
    const paths = (
        await git(["ls-files", "--cached", "--others", "--exclude-standard", "--", "*.md"])
    )
        .split("\n")
        .filter(Boolean);
    const read = await Promise.all(
        paths.map(async (path): Promise<DocPage | undefined> => {
            const absolute = resolve(WORKSPACE_ROOT, path);

            if (!(await exists(absolute))) return undefined;

            const source = await readFile(absolute, "utf8");

            const title = source.match(HEADING)?.[0]?.replace(/^#{1,3}\s+/, "");
            const updatedAt = (await git(["log", "-1", "--format=%cI", "--", path])).trim();
            const decisionMeta = decisionMetaOf(path, source);

            return {
                path,
                kind: kindOf(path),
                title: title?.trim() ?? path,
                words: source.split(/\s+/).filter(Boolean).length,
                updatedAt: updatedAt || null,
                decisionStatus: decisionMeta.status,
                decisionOutcome: decisionMeta.decision,
                decisionSupersededBy: decisionMeta.supersededBy,
                audit: auditMetaOf(path, source),
            };
        }),
    );
    const pages = read.filter((page): page is DocPage => page !== undefined);

    pages.sort((a, b) => a.path.localeCompare(b.path));

    return { generatedAt, pages };
};
