import { toDecisionReports } from "#layers/decisions/shared/decisionReports.ts";

/** Read off the collected snapshot rather than the content collection, because the frontmatter both pills show is parsed and validated there. */
export const useDecisionReports = () => {
    return computed(() => toDecisionReports(docsArtifact()?.pages ?? []));
};
