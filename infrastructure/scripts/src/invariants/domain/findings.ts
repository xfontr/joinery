/** The portal's `InvariantFinding` plus `blocks`, so the portal can render this list unchanged. */
export interface Finding {
    id: string;
    title: string;
    detail: string;
    evidence: string[];
    blocks: boolean;
}

export const blocking = (findings: Finding[]): Finding[] =>
    findings.filter((finding) => finding.blocks);
