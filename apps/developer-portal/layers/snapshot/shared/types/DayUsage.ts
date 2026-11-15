/** One script's runs on one calendar day. */
export interface DayUsage {
    runs: number;
    /** Runs whose caller is not `human`. */
    agent: number;
    failures: number;
}
