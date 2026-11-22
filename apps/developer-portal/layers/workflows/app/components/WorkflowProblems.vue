<template>
    <UAlert
        v-if="problems.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="`${problems.length} workflow file problems`"
    >
        <template #description>
            <ul class="list-disc pl-4">
                <li v-for="problem in problems" :key="problem.file + problem.message">
                    <code class="font-mono">{{ problem.file }}</code
                    >: {{ problem.message }}
                </li>
            </ul>
        </template>
    </UAlert>
</template>

<script setup lang="ts">
import type { WorkflowProblem } from "#layers/workflows/shared/workflows.ts";

interface Props {
    problems: WorkflowProblem[];
}

const { problems } = defineProps<Props>();
</script>
