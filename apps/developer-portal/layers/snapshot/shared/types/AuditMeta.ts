import type { AuditFinding } from "../audits.ts";

export interface AuditMeta {
    /** The project or path the audit read, as its frontmatter names it; null when missing. */
    scope: string | null;
    commit: string | null;
    findings: AuditFinding[];
}
