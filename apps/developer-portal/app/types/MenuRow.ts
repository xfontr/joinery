interface MenuRowShared {
    to: string;
    icon?: string;
    badge?: string;
    coverage?: number | null;
    children?: MenuRow[];
}

/** A row a `menu` route answers with; a `coverage` row's badge takes the coverage tone. */
export type MenuRow = MenuRowShared &
    (
        | {
              /** Record data such as a project's name. */
              label: string;
          }
        | {
              /** A row the route words itself, resolved against the locale on the client. */
              labelKey: string;
          }
    );
