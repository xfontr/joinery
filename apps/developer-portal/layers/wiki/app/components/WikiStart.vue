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
        label: "Explore",
        items: [
            {
                to: "/wiki/readme",
                label: "Repository overview",
                hint: "What this monorepo contains",
                icon: "i-lucide-map",
            },
            {
                to: "/projects",
                label: "Project catalog",
                hint: "Applications, packages, and tooling",
                icon: "i-lucide-boxes",
            },
        ],
    },
    {
        label: "Understand",
        items: [
            {
                to: "/wiki/docs/concepts/boundaries",
                label: "Architecture and boundaries",
                hint: "How projects are allowed to depend",
                icon: "i-lucide-git-branch",
            },
            {
                to: "/graph",
                label: "Architecture view",
                hint: "How the collected projects fit together",
                icon: "i-lucide-git-fork",
            },
        ],
    },
    {
        label: "Contribute",
        items: [
            {
                to: "/wiki/docs/guides/first-hour",
                label: "First hour",
                hint: "An ordered way into the repository",
                icon: "i-lucide-play",
            },
        ],
    },
];

const groups = computed(() =>
    GROUPS.map((group) => ({
        ...group,
        items: group.items.filter(
            (entry) => !entry.to.startsWith("/wiki/") || known.has(entry.to.slice("/wiki".length)),
        ),
    })).filter((group) => group.items.length > 0),
);
</script>
