/** The vocabularies `docs/workflows/README.md` documents, as the one copy every other spelling derives from. */
export const REUSE_PLANS = ["package", "extract", "copy", "method", "new"] as const;

export const KINDS = ["build", "spike", "owner"] as const;

export const SETTLED_STATES = ["done", "skipped"] as const;

/** How much a person oversees the code, which sets how many points a filed ticket may hold. */
export const TICKET_SIZES = ["block", "supervised", "fast"] as const;

export const CAPABILITY_STATES = [
    "off",
    "skipped",
    "waits",
    "can-file",
    "blocked",
    "waiting-on-you",
    "ready",
    "in-flight",
    "done",
] as const;

export const TICKET_STATUSES = [
    "waiting-on-you",
    "ready",
    "in-flight",
    "blocked",
    "done",
    "dropped",
] as const;

/** A `dependsOn` entry with this prefix needs every other block in the named stage. */
export const STAGE_NEED_PREFIX = "stage:";

/** The prefix of the GitHub label that places an issue under a capability. */
export const CAPABILITY_LABEL_PREFIX = "cap:";

/** The Fibonacci values a complexity estimate may take; anything bigger is a block to split. */
export const COMPLEXITY_SCALE = [1, 2, 3, 5, 8, 13, 21] as const;
