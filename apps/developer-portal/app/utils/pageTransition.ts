import type { PageTransition } from "../types/PageTransition.ts";

export const pageTransitionOf = (fromLayout: unknown, toLayout: unknown): PageTransition => {
    const fromVisitor = fromLayout === "visitor";
    const toVisitor = toLayout === "visitor";

    if (fromVisitor !== toVisitor) return "mode";
    return toVisitor ? "visitor" : "dev";
};

/** Names an element and its counterpart on the next page, so the transition carries one into the other. */
export const carried = (name: string) => ({ viewTransitionName: name });
