/** A row a `menu` route answers with; a `coverage` row's badge takes the coverage tone. */
export interface MenuRow {
    label: string;
    to: string;
    icon?: string;
    badge?: string;
    coverage?: number | null;
    children?: MenuRow[];
}
