import { openAudits } from "#layers/audits/shared/auditReports.ts";
import { toImplement } from "#layers/decisions/shared/decisionReports.ts";
import { toCollectionPath } from "#layers/docs/shared/docPages.ts";
import { sortIssues } from "#layers/github/app/utils/issues.ts";
import { brokenPages } from "#layers/snapshot/app/utils/docs.ts";
import { unreleased } from "#layers/snapshot/app/utils/metrics.ts";
import type { QueueKind } from "~/types/QueueKind";
import type { QueueRow } from "~/types/QueueRow";

/** Everything open across the repo for Home's queue, one list per kind of work. */
export const useWorkQueue = () => {
    const { t } = useI18n();
    const { shown: issues } = useIssues();
    const decisions = useDecisionReports();
    const audits = useAuditReports();
    const metrics = metricsArtifact();
    const docs = docsArtifact();

    const rows = computed((): Record<QueueKind, QueueRow[]> => ({
        issues: sortIssues(issues.value.issues).map((issue) => ({
            key: `issue-${issue.number}`,
            id: `#${issue.number}`,
            title: issue.title,
            meta: shortAge(issue.updatedAt, t),
            to: issue.url,
            external: true,
        })),
        decisions: toImplement(decisions.value).map((report) => ({
            key: `decision-${report.id}`,
            id: report.number,
            title: report.title,
            meta: t("workQueue.rows.toImplement"),
            to: `/decisions/${report.id}`,
        })),
        audits: openAudits(audits.value).map((report) => ({
            key: `audit-${report.id}`,
            id: report.date.slice("YYYY-".length),
            title: report.title,
            meta: t("workQueue.rows.auditOpen", {
                open: report.counts.open,
                total: report.findings.length,
            }),
            to: `/audits/${report.id}`,
        })),
        releases: unreleased(metrics?.projects).map((project) => ({
            key: `release-${project.root}`,
            id: `+${project.unreleasedCommits}`,
            title: project.name,
            meta: t("workQueue.rows.release", {
                version: project.currentVersion ?? t("workQueue.rows.unversioned"),
            }),
            to: `/projects/${folderOf(project.root)}`,
        })),
        attention: [
            ...(metrics?.invariantFindings ?? []).map((finding) => ({
                key: `finding-${finding.id}`,
                id: t("workQueue.rows.invariant"),
                title: finding.title,
                meta: finding.detail,
                to: null,
            })),
            ...brokenPages(docs).map((page) => ({
                key: `docs-${page.path}`,
                id: t("workQueue.rows.link"),
                title: page.path,
                meta: t("workQueue.rows.brokenLinks", { count: page.brokenLinks.length }),
                to: `/wiki${toCollectionPath(page.path)}`,
            })),
        ],
    }));

    return { rows, issues };
};
