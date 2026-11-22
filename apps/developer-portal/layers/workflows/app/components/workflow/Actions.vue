<template>
    <span class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-refresh-cw" class="size-3.5" />
        <template v-if="syncedAt">Snapshot updated {{ synced }}</template>
        <template v-else>
            Never synced — run
            <code class="font-mono text-default">pnpm workflow:setup {{ project }}</code>
            then
            <code class="font-mono text-default">pnpm workflow:sync {{ project }}</code>
        </template>
    </span>
    <UButton
        v-if="found"
        :to="`/workflows/${project}/settings`"
        label="Settings"
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

const synced = computed(() => relativeTime(syncedAt));
</script>
