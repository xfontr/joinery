import type { NavigationMenuItem } from "@nuxt/ui";
import type { ComputedRef } from "vue";
import { appEntries, locate } from "~/utils/apps";
import type { MenuRow } from "~/types/MenuRow";
import type { NavLink } from "~/types/NavLink";

/** The rail's nav tree: each app, its entries with their badges, and the rows each `menu` route answers. */
export const useRailEntries = (
    figures: ComputedRef<Record<string, { badge?: { label: string; class: string } }>>,
) => {
    const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
    const { t } = useI18n();
    const apps = appEntries(nav, t);
    const route = useRoute();

    const menus: Record<string, Ref<MenuRow[]>> = {};
    for (const [key, link] of Object.entries(nav)) {
        if (link?.menu) {
            menus[key] = useFetch<MenuRow[]>(link.menu, {
                key: `menu-${key}`,
                default: () => [],
            }).data;
        }
    }

    const here = computed(() => locate(apps, route.path));

    const holds = (row: MenuRow): boolean => row.to === route.fullPath || row.to === route.path;

    const toItem = (row: MenuRow): NavigationMenuItem => ({
        label: row.label,
        icon: row.icon,
        to: row.to,
        active: row.to === route.fullPath,
        badge:
            row.badge === undefined
                ? undefined
                : { label: row.badge, class: toneClass(coverageTone(row.coverage)) },
    });

    const menuSections = (rows: MenuRow[]): NavigationMenuItem[] =>
        (rows.find((row) => (row.children ?? []).some(holds))?.children ?? rows).map(toItem);

    const items = computed((): NavigationMenuItem[] =>
        apps.map((app) => {
            const [first] = app.entries;
            const single = app.entries.length === 1;

            return {
                label: app.label,
                icon: app.icon,
                to: first?.to,
                value: app.id,
                active: here.value?.app.id === app.id,
                defaultOpen: here.value?.app.id === app.id,
                children: single
                    ? undefined
                    : app.entries.map((entry) => {
                          const children = menuSections(menus[entry.key]?.value ?? []);

                          return {
                              label: entry.label,
                              icon: entry.icon,
                              to: entry.to,
                              value: entry.key,
                              active: here.value?.entry.key === entry.key,
                              defaultOpen:
                                  here.value?.entry.key === entry.key && route.path !== entry.to,
                              badge: figures.value[entry.key]?.badge,
                              children: children.length === 0 ? undefined : children,
                          };
                      }),
            };
        }),
    );

    return { apps, menus, items };
};
