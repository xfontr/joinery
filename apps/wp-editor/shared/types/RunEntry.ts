import type { ItemKey } from "./ItemKey.ts";

export interface RunEntry {
    key: ItemKey;
    reason: string;
}
