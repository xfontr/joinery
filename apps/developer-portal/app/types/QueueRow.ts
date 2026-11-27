/** One open item in Home's work queue. */
export interface QueueRow {
    key: string;
    id: string;
    title: string;
    meta: string;
    to: string;
    external?: boolean;
}
