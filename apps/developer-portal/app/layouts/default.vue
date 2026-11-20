<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="dashboard"
            resizable
            collapsible
            :default-size="15"
            :min-size="12"
            :max-size="20"
            :collapsed-size="3.5"
            :ui="{
                root: 'surface-ink min-h-0 border-e border-default',
                content: 'surface-ink lg:hidden',
                header: 'h-14 pr-2 pl-5',
                body: 'gap-4 px-3 py-0 pb-4',
                footer: 'border-t border-default px-3',
            }"
        >
            <template #header="{ collapsed }">
                <NuxtLink
                    v-if="!collapsed"
                    to="/"
                    class="min-w-0 flex-1 font-display text-xl text-highlighted italic"
                    aria-label="Monorepo visitor view"
                >
                    monorepo
                </NuxtLink>
                <UDashboardSidebarCollapse
                    color="neutral"
                    class="text-muted"
                    :class="collapsed && 'mx-auto'"
                />
            </template>

            <template #default="{ collapsed }">
                <UButton
                    v-if="collapsed"
                    to="/"
                    icon="i-lucide-arrow-left-right"
                    color="neutral"
                    variant="ghost"
                    class="mx-auto text-muted"
                    aria-label="Switch to the visitor view"
                    title="Visitor view"
                />
                <ViewSwitch v-else current="dev" class="self-start" />

                <UDashboardSearchButton
                    :collapsed
                    color="neutral"
                    variant="outline"
                    size="sm"
                    class="bg-elevated text-sm font-normal text-muted ring-default"
                    :ui="{ leadingIcon: 'size-3.5' }"
                />

                <!-- It hands every nested list's open state to one v-model, so it stays uncontrolled -->
                <UNavigationMenu
                    :key="route.path"
                    :items="railItems"
                    :collapsed
                    orientation="vertical"
                    color="neutral"
                    variant="link"
                    highlight
                    highlight-color="primary"
                    trailing-trigger
                    popover
                    :ui="{
                        link: 'h-9 gap-2.5 px-2 py-0 font-normal text-muted hover:text-highlighted data-active:font-medium data-active:text-highlighted',
                        linkLeadingIcon: 'size-4',
                        linkTrailingIcon: 'size-3.5',
                        childLink: 'h-8 items-center gap-2 py-0 text-sm',
                        childLinkIcon: 'size-3.5',
                        linkTrailingBadge:
                            'bg-transparent px-0 font-mono text-xs text-muted ring-0',
                    }"
                    aria-label="Developer view"
                />
            </template>

            <template #footer="{ collapsed }">
                <div class="flex w-full items-center gap-1" :class="collapsed && 'flex-col'">
                    <UColorModeButton
                        :label="collapsed ? undefined : 'Theme'"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        class="text-muted"
                        :ui="{ leadingIcon: 'size-3.5' }"
                    />

                    <UButton
                        :to="repoUrl"
                        target="_blank"
                        icon="i-simple-icons-github"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        :label="collapsed ? undefined : 'Source'"
                        :ui="{ leadingIcon: 'size-3.5' }"
                        class="text-muted"
                        :class="!collapsed && 'ml-auto'"
                        aria-label="View source on GitHub"
                    />
                </div>
            </template>
        </UDashboardSidebar>

        <UDashboardSearch
            v-model:open="searchOpen"
            :groups="searchGroups"
            :loading="status === 'pending'"
            placeholder="Search pages, projects and docs…"
        />

        <slot />
    </UDashboardGroup>

    <StatusBar
        :collected="badges?.collected ?? null"
        :items="statusItems"
        :style="{ '--rail': `${railWidth}px` }"
        class="lg:left-(--rail)"
    />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { StatusItem } from "~/components/StatusBar.vue";
import { appEntries, locate, type MenuRow, type NavLink, type RailFigure } from "~/utils/apps";
import type { Tone } from "~/utils/format";
import { matchPages, searchGroups as toSearchGroups } from "~/utils/search";

const { data: issues } = useIssues();
const { data: badges } = await useFetch<Badges>("/api/badges", { key: "badges" });
const {
    public: { repoUrl },
} = useRuntimeConfig();

const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
const apps = appEntries(nav);

const mounted = ref(false);
onMounted(() => (mounted.value = true));

/** GitHub is read in the browser, so the prerendered HTML can't know the count. */
const openIssues = computed(() =>
    mounted.value && issues.value.fetchedAt && !issues.value.error
        ? issues.value.issues.length
        : null,
);

const routesFor = (field: "menu" | "figure"): [string, string][] =>
    Object.entries(nav).flatMap(([key, link]) => {
        const url = link?.[field];
        return url ? [[key, url] as [string, string]] : [];
    });

const menus = Object.fromEntries(
    routesFor("menu").map(([key, url]) => [
        key,
        useFetch<MenuRow[]>(url, { key: `menu-${key}`, default: () => [] }).data,
    ]),
);

const figures = Object.fromEntries(
    routesFor("figure").map(([key, url]) => [
        key,
        useFetch<RailFigure>(url, { key: `figure-${key}` }).data,
    ]),
);

const tooling = computed(() => figures.telemetry?.value ?? null);

const toolingTone = computed((): Tone => (tooling.value?.alert ? "bad" : "neutral"));
const worstTone = computed((): Tone => {
    const worst = badges.value?.worstSeverity ?? null;
    return worst ? severityTone(worst) : "neutral";
});

const badge = (label: string, tone: Tone) => ({ label, class: toneClass(tone) });

/** The figure beside each entry, in its tone, as the lab's rail prints a section's state. */
const entryBadges = computed((): Record<string, { label: string; class: string } | undefined> => {
    const lines = badges.value?.lineCoverage ?? null;

    return {
        issues: openIssues.value ? badge(String(openIssues.value), "neutral") : undefined,
        coverage: lines === null ? undefined : badge(`${lines}%`, coverageTone(lines)),
        deps: badges.value?.collected
            ? badge(`${badges.value.advisories} adv.`, worstTone.value)
            : undefined,
        telemetry: tooling.value
            ? badge(`${tooling.value.value} fail`, toolingTone.value)
            : undefined,
    };
});

const route = useRoute();

const railWidth = ref(0);

// The status bar starts where the rail ends, and the rail's width is only known once it renders
const observer = import.meta.client
    ? new ResizeObserver(([entry]) => {
          railWidth.value = entry?.borderBoxSize[0]?.inlineSize ?? 0;
      })
    : null;

// Nuxt UI ids the rail `<storageKey>-sidebar-<id>`, and the component renders more than one root
onMounted(() => {
    const rail = document.getElementById("dashboard-sidebar-dashboard");
    if (rail) observer?.observe(rail);
});
onBeforeUnmount(() => observer?.disconnect());
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

/** A menu one level deep at a time: inside a group, its members stand in for the groups. */
const menuSections = (rows: MenuRow[]): NavigationMenuItem[] =>
    (rows.find((row) => (row.children ?? []).some(holds))?.children ?? rows).map(toItem);

const railItems = computed((): NavigationMenuItem[] =>
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
                          // Router matching alone leaves `/projects` dark on `/projects/<name>`.
                          active: here.value?.entry.key === entry.key,
                          defaultOpen: here.value?.entry.key === entry.key,
                          badge: entryBadges.value[entry.key],
                          children: children.length === 0 ? undefined : children,
                      };
                  }),
        };
    }),
);

const statusItems = computed((): StatusItem[] => {
    const lines = badges.value?.lineCoverage ?? null;
    const worst = badges.value?.worstSeverity ?? null;
    const pages = badges.value?.docPages ?? null;
    const broken = badges.value?.brokenLinks ?? 0;

    return [
        {
            id: "coverage",
            label: "coverage",
            value: lines === null ? "—" : `${lines}%`,
            detail: "lines",
            tone: coverageTone(lines),
            to: "/coverage",
        },
        {
            id: "advisories",
            label: "advisories",
            value: badges.value?.collected ? String(badges.value.advisories) : "—",
            detail: worst ? `worst ${worst}` : "none",
            tone: worst ? severityTone(worst) : "neutral",
            to: "/deps",
        },
        ...(tooling.value
            ? [
                  {
                      id: "tooling",
                      label: "tooling",
                      value: tooling.value.value,
                      detail: "failed",
                      tone: toolingTone.value,
                      to: "/telemetry",
                  },
              ]
            : []),
        {
            id: "issues",
            label: "issues",
            value: openIssues.value === null ? "—" : String(openIssues.value),
            detail: "open",
            tone: mounted.value && issues.value.error ? "warn" : "neutral",
            to: "/issues",
        },
        {
            id: "docs",
            label: "docs",
            value: pages === null ? "—" : String(pages),
            detail: broken > 0 ? counted(broken, "broken link") : "no broken links",
            tone: broken > 0 ? "bad" : "neutral",
            to: "/wiki",
        },
    ];
});

const searchOpen = ref(false);

// Deferred to the first open; built here it rides in every prerendered payload (../../README.md).
const {
    data: sections,
    status,
    execute,
} = useAsyncData("search-sections", () => queryCollectionSearchSections("docs"), {
    default: () => [],
    immediate: false,
    server: false,
});

watch(searchOpen, () => {
    if (searchOpen.value && status.value === "idle") execute();
});

const projectGroup = computed(() => ({
    id: "projects",
    label: "Projects",
    ignoreFilter: true,
    postFilter: matchPages,
    items: (menus.projects?.value ?? []).flatMap((kind) =>
        (kind.children ?? []).map((row) => ({
            label: row.label,
            suffix: kind.label,
            to: row.to,
            icon: "i-lucide-box",
        })),
    ),
}));

const searchGroups = computed(() => {
    const [pages, ...docs] = toSearchGroups(apps, sections.value);
    return [...(pages ? [pages] : []), projectGroup.value, ...docs];
});
</script>
