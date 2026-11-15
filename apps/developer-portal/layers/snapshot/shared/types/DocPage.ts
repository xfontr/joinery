import type { DecisionOutcome, DecisionStatus } from "../decisions.ts";
import type { AuditMeta } from "./AuditMeta.ts";
import type { DocKind } from "./DocKind.ts";
import type { DocLink } from "./DocLink.ts";

export interface DocPage {
    path: string;
    kind: DocKind;
    title: string;
    words: number;
    updatedAt: string | null;
    /** Parsed from a decision report's frontmatter; null for anything that isn't one. */
    decisionStatus: DecisionStatus | null;
    decisionOutcome: DecisionOutcome | null;
    /** The file a superseded decision was replaced by; null unless `decisionOutcome` is `"superseded"`. */
    decisionSupersededBy: string | null;
    /** Parsed from an audit's frontmatter and findings tables; null for anything that isn't one. */
    audit: AuditMeta | null;
    brokenLinks: DocLink[];
}
