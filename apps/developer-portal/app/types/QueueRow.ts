/** One open item in Home's work queue; a row with no `to` has no page to open. */
export interface QueueRow {
    key: string;
    id: string;
    title: string;
    meta: string;
    to: string | null;
    external?: boolean;
}
