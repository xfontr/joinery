import type { BaseMeta } from "./BaseMeta.ts";
import type { ItemKey } from "./ItemKey.ts";
import type { ItemState } from "./ItemState.ts";
import type { Proposal } from "./Proposal.ts";
import type { Snapshot } from "./Snapshot.ts";

export interface Item {
    key: ItemKey;
    base: Snapshot & BaseMeta;
    proposal: Proposal | null;
    state: ItemState;
}
