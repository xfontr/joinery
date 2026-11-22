import type { NavLink } from "~/types/NavLink";

export interface AppEntry extends NavLink {
    key: string;
    label: string;
}
