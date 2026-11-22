<template>
    <span class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-refresh-cw" class="size-3.5" />
        <template v-if="syncedAt">{{ $t("workflowActions.synced", { age: synced }) }}</template>
        <I18nT v-else keypath="workflowActions.never" scope="global">
            <template #setup>
                <code class="font-mono text-default">{{ `pnpm workflow:setup ${project}` }}</code>
            </template>
            <template #sync>
                <code class="font-mono text-default">{{ `pnpm workflow:sync ${project}` }}</code>
            </template>
        </I18nT>
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

const { t } = useI18n();

const synced = computed(() => relativeTime(syncedAt, t));
</script>
