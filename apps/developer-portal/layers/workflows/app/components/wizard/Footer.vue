<template>
    <footer class="flex items-center justify-between gap-3 pt-2">
        <UButton
            v-if="!first"
            :label="$t('wizardFooter.back')"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="emit('back')"
        />
        <span v-else />
        <UButton
            v-if="!last"
            :label="$t('wizardFooter.next')"
            trailing-icon="i-lucide-arrow-right"
            :disabled="!canAdvance"
            @click="emit('next')"
        />
        <UButton
            v-else-if="editable"
            :label="$t('wizardFooter.create')"
            icon="i-lucide-check"
            :loading="creating"
            @click="emit('create')"
        />
        <span v-else class="flex items-center gap-2">
            <UButton
                :label="$t('wizardFooter.download')"
                icon="i-lucide-download"
                color="neutral"
                variant="outline"
                @click="emit('download')"
            />
            <UButton :label="$t('wizardFooter.create')" icon="i-lucide-check" disabled />
        </span>
    </footer>

    <UAlert
        v-if="!editable && last"
        color="warning"
        variant="subtle"
        icon="i-lucide-lock"
        :title="$t('wizardFooter.readOnly.title')"
        :description="$t('wizardFooter.readOnly.description', { id })"
    />
</template>

<script setup lang="ts">
interface Props {
    /** The project id, naming the file a read-only portal asks for. */
    id: string;
    first: boolean;
    last: boolean;
    canAdvance: boolean;
    editable: boolean;
    creating?: boolean;
}

const { id, first, last, canAdvance, editable, creating = false } = defineProps<Props>();
const emit = defineEmits<{ back: []; next: []; create: []; download: [] }>();
</script>
