export interface NavLink {
    label: string;
    icon: string;
    to: string;
    /** A route answering with the submenu, so every page's payload carries a few rows, not the feature's data. */
    menu?: string;
    /** A route answering with the `RailFigure` the rail prints beside the entry. */
    figure?: string;
}
