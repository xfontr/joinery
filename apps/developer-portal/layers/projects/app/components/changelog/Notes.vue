<template>
    <UAlert
        v-if="unreleased"
        color="warning"
        variant="subtle"
        icon="i-lucide-package-open"
        :title="$t('changelogNotes.unreleased.title')"
        :description="$t('changelogNotes.unreleased.description', { projects: unreleased })"
    />

    <!-- Changelogs and versions both come from commit subjects, so one commitlint would reject never ships. -->
    <UAlert
        v-if="conventional !== null"
        :color="conventional === 100 ? 'neutral' : 'warning'"
        variant="subtle"
        icon="i-lucide-git-commit-horizontal"
        :title="$t('changelogNotes.conventional.title')"
        :description="$t('changelogNotes.conventional.description', { percent: conventional })"
        :ui="{ description: 'text-xs' }"
    />
</template>

<script setup lang="ts">
import { projectDisplayName } from "#layers/projects/app/utils/changelogs.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";

interface Props {
    projects: ProjectMetrics[];
    /** The share of recent commit subjects that parse, or null when it wasn't collected. */
    conventional: number | null;
}

const { projects, conventional } = defineProps<Props>();

// Projects with shipped commits and no CHANGELOG.md, the gap this page is for.
const unreleased = computed(() =>
    projects
        .filter((project) => !project.hasChangelog && (project.unreleasedCommits ?? 0) > 0)
        .map((project) => projectDisplayName(project.root))
        .join(", "),
);
</script>
