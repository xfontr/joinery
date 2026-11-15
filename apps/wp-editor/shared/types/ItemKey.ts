import type { PostType } from "./PostType.ts";

/** `<type>-<id>`, so posts and pages share one model. */
export type ItemKey = `${PostType}-${number}`;
