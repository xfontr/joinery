import type { MenuRow } from "~/types/MenuRow";
import type { Translate } from "~/types/Translate";

export const menuLabel = (row: MenuRow, t: Translate): string =>
    "labelKey" in row ? t(row.labelKey) : row.label;
