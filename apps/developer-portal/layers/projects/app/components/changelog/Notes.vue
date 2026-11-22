<template>
    <UAlert
        v-if="unreleased"
        color="warning"
        variant="subtle"
        icon="i-lucide-package-open"
        title="Never released"
        :description="`${unreleased} — commits waiting on a first release, so no changelog yet.`"
    />

    <!-- Changelogs and versions both come from commit subjects, so one commitlint would reject never ships. -->
    <UAlert
        v-if="conventional !== null"
        :color="conventional === 100 ? 'neutral' : 'warning'"
        variant="subtle"
        icon="i-lucide-git-commit-horizontal"
        title="Conventional subjects"
        :description="`${conventional}% of the last 100 commits parse as a version bump.`"
        :ui="{ description: 'text-xs' }"
    />
</template>

<script setup lang="ts">
import { projectDisplayName } from "#layers/projects/shared/changelogs.ts";
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
