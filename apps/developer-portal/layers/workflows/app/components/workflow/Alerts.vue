<template>
    <UAlert
        v-if="blank"
        color="info"
        variant="subtle"
        icon="i-lucide-map"
        title="This project has no blocks yet"
    >
        <template #description>
            Ask Claude to draft its map: it asks what the project is, writes the blocks under
            <code class="font-mono">extras</code> in
            <code class="font-mono">data/workflows/projects/{{ project }}.yaml</code>, and they show
            here for you to check before anything is filed.
        </template>
    </UAlert>

    <UAlert
        v-if="problems.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="This project's files have problems"
    >
        <template #description>
            <ul class="list-disc pl-4">
                <li v-for="problem in problems" :key="problem">{{ problem }}</li>
            </ul>
        </template>
    </UAlert>

    <UAlert
        v-if="unsorted.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-inbox"
        :title="`${unsorted.length} to organise`"
    >
        <template #description>
            <p>
                Not placed yet. Give each one the milestone and a
                <code class="font-mono">cap:&lt;capability&gt;</code> label on GitHub, then sync
                again.
            </p>
            <ul class="mt-2 flex flex-col gap-1">
                <li
                    v-for="{ issue, reason } in unsorted"
                    :key="issue.number"
                    class="flex items-center gap-3"
                >
                    <a :href="issue.url" target="_blank" class="font-mono text-xs text-dimmed">
                        #{{ issue.number }}
                    </a>
                    <span class="min-w-0 flex-1 truncate text-default">{{ issue.title }}</span>
                    <span class="text-xs">{{ reason }}</span>
                </li>
            </ul>
        </template>
    </UAlert>
</template>

<script setup lang="ts">
import type { UnsortedIssue } from "#layers/workflows/shared/workflows.ts";

interface Props {
    project: string;
    blank: boolean;
    problems: string[];
    /** Issues still to place, or none while replaying an earlier day. */
    unsorted: UnsortedIssue[];
}

const { project, blank, problems, unsorted } = defineProps<Props>();
</script>
