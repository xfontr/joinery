<template>
    <span v-if="!syncedAt" class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-refresh-cw" class="size-3.5" />
        {{ $t("workflowActions.never") }}
    </span>
    <UButton
        v-if="found"
        :to="`/workflows/${project}/settings`"
        :label="$t('workflowActions.settings')"
        icon="i-lucide-settings"
        color="neutral"
        variant="outline"
        size="sm"
    />
</template>

<script setup lang="ts">
interface Props {
    project: string;
    /** Whether a file for the project exists, so it has settings to open. */
    found: boolean;
    syncedAt?: string | null;
}

const { project, found, syncedAt = null } = defineProps<Props>();
</script>
