import type { DocPage } from "./DocPage.ts";

export interface DocsArtifact {
    generatedAt: string;
    pages: DocPage[];
    brokenLinkCount: number;
}
