/**
 * `doc`, `decision` and `audit` are the ones that live under `docs/`, which is where anything
 * spanning more than one project belongs. The rest are colocated with the code they describe.
 */
export type DocKind = "readme" | "agent" | "changelog" | "skill" | "doc" | "decision" | "audit";
