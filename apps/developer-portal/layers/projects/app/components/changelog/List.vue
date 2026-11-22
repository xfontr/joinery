<template>
    <UCard variant="flush">
        <div class="divide-y divide-default">
            <button
                v-for="entry in entries"
                :key="entry.path"
                type="button"
                class="w-full px-4 py-2.5 text-left transition-colors hover:bg-elevated/50"
                :class="selected === entry.path ? 'bg-elevated' : ''"
                @click="selected = entry.path"
            >
                <div class="truncate font-mono text-sm">{{ entry.name }}</div>
                <div class="flex items-center gap-2 text-xs text-dimmed">
                    <span v-if="entry.version">
                        {{ $t("changelogList.version", { version: entry.version }) }}
                    </span>
                    <span v-if="entry.unreleased > 0" class="tone-warn">
                        {{ $t("changelogList.unreleased", { count: entry.unreleased }) }}
                    </span>
                </div>
            </button>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { changelogRoot, projectDisplayName } from "#layers/projects/app/utils/changelogs.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";

interface Props {
    changelogs: { path: string }[];
    projects: ProjectMetrics[];
}

const { changelogs, projects } = defineProps<Props>();
const selected = defineModel<string | null>({ required: true });

const entries = computed(() =>
    changelogs.map(({ path }) => {
        const root = changelogRoot(path);
        const metric = projects.find((project) => project.root === root);
        return {
            path,
            name: projectDisplayName(root),
            version: metric?.currentVersion ?? null,
            unreleased: metric?.unreleasedCommits ?? 0,
        };
    }),
);
</script>
