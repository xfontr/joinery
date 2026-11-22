import { toAuditReports } from "#layers/audits/shared/auditReports.ts";

/** Read off the collected snapshot rather than the content collection, because the findings tables are parsed there. */
export const useAuditReports = () => {
    return computed(() => toAuditReports(docsArtifact()?.pages ?? []));
};
