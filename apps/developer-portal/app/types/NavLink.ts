/** Its label is the `app.nav.<key>` copy, the key being the one it sits under in `nav`. */
export interface NavLink {
    icon: string;
    to: string;
    /** A route answering with the submenu, so every page's payload carries a few rows, not the feature's data. */
    menu?: string;
    /** A route answering with the `RailFigure` the rail prints beside the entry. */
    figure?: string;
}
