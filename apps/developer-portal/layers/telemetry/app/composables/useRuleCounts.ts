/** Fetched rather than read from `usageArtifact()`, which would bundle the whole artifact. */
export const useRuleCounts = () =>
    useFetch("/api/telemetry/rules", {
        key: "rule-counts",
        // h3 answers a null with an empty body, which arrives as undefined.
        transform: (counts) => counts ?? null,
        default: () => null,
    });
