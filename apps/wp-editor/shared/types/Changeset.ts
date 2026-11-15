import type { ChangesetStatus } from "./ChangesetStatus.ts";
import type { ItemKey } from "./ItemKey.ts";

export interface Changeset {
    id: string;
    title: string;
    instructions: string;
    createdAt: string;
    status: ChangesetStatus;
    keys: ItemKey[];
    scanned: ItemKey[];
}
