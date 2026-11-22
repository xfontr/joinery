<template>
    <div class="flex items-center justify-end gap-3">
        <span v-if="changed" class="text-sm text-muted">{{ $t("settingsSave.unsaved") }}</span>
        <UButton
            :label="$t('settingsSave.discard')"
            color="neutral"
            variant="ghost"
            :disabled="!changed"
            @click="emit('discard')"
        />
        <UButton
            :label="$t('settingsSave.save')"
            :disabled="!changed"
            :loading="saving"
            @click="emit('save')"
        />
    </div>
</template>

<script setup lang="ts">
interface Props {
    changed: boolean;
    saving?: boolean;
}

const { changed, saving = false } = defineProps<Props>();
const emit = defineEmits<{ save: []; discard: [] }>();
</script>
