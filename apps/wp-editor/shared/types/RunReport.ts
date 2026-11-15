import type { ItemKey } from "./ItemKey.ts";
import type { RunEntry } from "./RunEntry.ts";

/** One bulk run, kept in the changeset so what happened can be read back later. */
export interface RunReport {
    kind: "apply" | "dry-run" | "restore";
    at: string;
    /** Applied, restored, or for a dry run, would apply. */
    ok: ItemKey[];
    /** A rule said no, such as drift. */
    refused: RunEntry[];
    /** WordPress or the network errored. */
    failed: RunEntry[];
    /** Went through, with something to check: changed block markers, or already live. */
    warnings: RunEntry[];
    /** Saved with every article until the last, so a report that still has it was stopped partway. */
    incomplete?: true;
    /** Progress saves only: how many articles the run will go through. */
    total?: number;
    /** Progress saves only: the article being checked or written right now. */
    current?: ItemKey;
    /** Why the run gave up before the last article; the rest are untouched. */
    stopped?: string;
    /** Dry run only: what would still keep bulk apply shut, besides the dry run itself. */
    blocker?: string | null;
    /** Dry run only: what each `ok` article looked like, so a later edit invalidates the run. */
    fingerprints?: Partial<Record<ItemKey, string>>;
}
