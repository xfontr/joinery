import type { DocPage } from "../../shared/types/DocPage.ts";
import type { DocsArtifact } from "../../shared/types/DocsArtifact.ts";

/** Only the pages that have a broken link; listing every page with none would be a wall. */
export const brokenPages = (docs: DocsArtifact | null | undefined): DocPage[] =>
    docs?.pages.filter((page) => page.brokenLinks.length > 0) ?? [];
