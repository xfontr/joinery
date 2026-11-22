import { toTitleCase } from "#layers/docs/shared/docPages.ts";

/** `/packages/ui/changelog` → `packages/ui`, which is how metrics keys its projects. */
export const changelogRoot = (path: string): string =>
    path.replace(/^\//, "").replace(/\/changelog$/i, "");

/** `packages/i18n` → `I18n`: the project's own name, not the area it lives under. */
export const projectDisplayName = (root: string): string =>
    toTitleCase(root.split("/").at(-1) ?? root);
