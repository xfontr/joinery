<template>
    <div class="flex flex-col gap-5">
        <section v-for="group in groups" :key="group.label" class="flex flex-col gap-2">
            <h2 class="text-sm font-semibold">{{ group.label }}</h2>
            <div class="grid gap-3 sm:grid-cols-2">
                <NuxtLink
                    v-for="entry in group.items"
                    :key="entry.to"
                    :to="entry.to"
                    class="flex flex-col gap-1 rounded-lg border border-default bg-default p-4 transition-colors hover:bg-elevated/50"
                >
                    <UIcon :name="entry.icon" class="size-4 text-primary" />
                    <span class="text-sm font-medium">{{ entry.label }}</span>
                    <span class="text-xs text-dimmed">{{ entry.hint }}</span>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
interface Props {
    /** Every path in the wiki tree, so a link to a doc that is gone is left out. */
    known: Set<string>;
}

const { known } = defineProps<Props>();

const GROUPS = [
    {
        id: "explore",
        items: [
            { id: "overview", to: "/wiki/readme", icon: "i-lucide-map" },
            { id: "catalog", to: "/projects", icon: "i-lucide-boxes" },
        ],
    },
    {
        id: "understand",
        items: [
            { id: "boundaries", to: "/wiki/docs/concepts/boundaries", icon: "i-lucide-git-branch" },
            { id: "graph", to: "/graph", icon: "i-lucide-git-fork" },
        ],
    },
    {
        id: "contribute",
        items: [{ id: "firstHour", to: "/wiki/docs/guides/first-hour", icon: "i-lucide-play" }],
    },
];

const { t } = useI18n();

const groups = computed(() =>
    GROUPS.map((group) => ({
        label: t(`wikiStart.groups.${group.id}`),
        items: group.items
            .filter(
                (entry) =>
                    !entry.to.startsWith("/wiki/") || known.has(entry.to.slice("/wiki".length)),
            )
            .map((entry) => ({
                ...entry,
                label: t(`wikiStart.items.${entry.id}.label`),
                hint: t(`wikiStart.items.${entry.id}.hint`),
            })),
    })).filter((group) => group.items.length > 0),
);
</script>
