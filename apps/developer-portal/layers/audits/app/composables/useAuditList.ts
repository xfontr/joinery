import { filterAudits, sortAudits, type AuditSort } from "#layers/audits/shared/auditReports.ts";
import type { AuditState } from "#layers/snapshot/shared/audits.ts";

/** Every collected audit and the filtered, sorted slice the list shows. */
export const useAuditList = () => {
    const reports = useAuditReports();

    const state = ref<AuditState | "all">("all");
    const scope = ref("all");
    const search = ref("");
    const sort = ref<AuditSort>("newest");

    const visible = computed(() =>
        sortAudits(
            filterAudits(reports.value, {
                state: state.value,
                scope: scope.value,
                search: search.value,
            }),
            sort.value,
        ),
    );

    return {
        manifest: snapshotManifest(),
        reports,
        state,
        scope,
        search,
        sort,
        visible,
    };
};
