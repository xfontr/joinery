<template>
    <UDashboardGroup unit="rem" class="bottom-7">
        <UDashboardSidebar
            id="dashboard"
            resizable
            collapsible
            :default-size="15"
            :min-size="12"
            :max-size="20"
            :collapsed-size="3.5"
            :ui="{
                root: 'surface-ink min-h-0 border-e-0',
                content: 'surface-ink lg:hidden',
                body: 'gap-3',
                footer: 'border-t border-default',
            }"
        >
            <template #header="{ collapsed }">
                <NuxtLink
                    v-if="!collapsed"
                    to="/overview"
                    class="flex min-w-0 flex-1 items-baseline gap-2"
                    aria-label="Monorepo developer view"
                >
                    <span class="font-display text-xl text-highlighted italic">monorepo</span>
                    <span class="text-sm text-muted">dev</span>
                </NuxtLink>
                <UDashboardSidebarCollapse
                    color="neutral"
                    class="text-muted"
                    :class="collapsed && 'mx-auto'"
                />
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton
                    :collapsed
                    color="neutral"
                    variant="outline"
                    class="bg-elevated text-muted ring-default"
                />

                <UNavigationMenu
                    v-model="openApps"
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
                        link: 'text-muted hover:text-highlighted data-active:text-highlighted',
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
                        class="text-muted"
                    />

                    <UButton
                        :to="repoUrl"
                        target="_blank"
                        icon="i-simple-icons-github"
                        color="neutral"
                        variant="ghost"
                        :label="collapsed ? undefined : 'Source'"
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

    <StatusBar :collected="badges?.collected ?? null" :items="statusItems" />
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

const routed = <T,>(field: "menu" | "figure", fallback: () => T) =>
    Object.fromEntries(
        Object.entries(nav).flatMap(([key, link]) => {
            const url = link?.[field];
            return url
                ? [[key, useFetch<T>(url, { key: `${field}-${key}`, default: fallback }).data]]
                : [];
        }),
    );

const menus = routed<MenuRow[]>("menu", () => []);
const figures = routed<RailFigure | null>("figure", () => null);

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
const here = computed(() => locate(apps, route.path));

const holds = (row: MenuRow): boolean =>
    row.to === route.fullPath || row.to === route.path || (row.children ?? []).some(holds);

const toItem = (row: MenuRow): NavigationMenuItem => ({
    label: row.label,
    icon: row.icon,
    to: row.to,
    active: row.to === route.fullPath,
    defaultOpen: (row.children ?? []).some(holds),
    badge:
        row.badge === undefined
            ? undefined
            : { label: row.badge, class: toneClass(coverageTone(row.coverage)) },
    children: row.children?.length ? row.children.map(toItem) : undefined,
});

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
            children: single
                ? undefined
                : app.entries.map((entry) => {
                      const children = (menus[entry.key]?.value ?? []).map(toItem);

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

/** The app holding the current page stays unfolded; the others fold back on navigation. */
const openApps = ref<string[]>([]);

// The prerendered HTML has every app folded, so unfolding one before hydration would mismatch.
const unfoldCurrent = (): void => {
    openApps.value = here.value ? [here.value.app.id] : [];
};

onMounted(unfoldCurrent);
watch(() => route.path, unfoldCurrent);

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
