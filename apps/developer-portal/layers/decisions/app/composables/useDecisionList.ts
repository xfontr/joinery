import {
    filterDecisions,
    sortDecisions,
    type DecisionSort,
} from "#layers/decisions/shared/decisionReports.ts";
import type { DecisionOutcome, DecisionStatus } from "#layers/snapshot/shared/decisions.ts";

/** Every collected decision and the filtered, sorted slice the list shows. */
export const useDecisionList = () => {
    const reports = useDecisionReports();

    const status = ref<DecisionStatus | "all">("all");
    const decision = ref<DecisionOutcome | "all">("all");
    const search = ref("");
    const sort = ref<DecisionSort>("newest");

    const visible = computed(() =>
        sortDecisions(
            filterDecisions(reports.value, {
                status: status.value,
                decision: decision.value,
                search: search.value,
            }),
            sort.value,
        ),
    );

    return {
        manifest: snapshotManifest(),
        reports,
        status,
        decision,
        search,
        sort,
        visible,
    };
};
