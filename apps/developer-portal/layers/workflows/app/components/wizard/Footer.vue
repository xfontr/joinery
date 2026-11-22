<template>
    <footer class="flex items-center justify-between gap-3 pt-2">
        <UButton
            v-if="!first"
            label="Back"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="emit('back')"
        />
        <span v-else />
        <UButton
            v-if="!last"
            label="Next"
            trailing-icon="i-lucide-arrow-right"
            :disabled="!canAdvance"
            @click="emit('next')"
        />
        <UButton
            v-else-if="editable"
            label="Create project"
            icon="i-lucide-check"
            :loading="creating"
            @click="emit('create')"
        />
        <span v-else class="flex items-center gap-2">
            <UButton
                label="Download YAML"
                icon="i-lucide-download"
                color="neutral"
                variant="outline"
                @click="emit('download')"
            />
            <UButton label="Create project" icon="i-lucide-check" disabled />
        </span>
    </footer>

    <UAlert
        v-if="!editable && last"
        color="warning"
        variant="subtle"
        icon="i-lucide-lock"
        title="You're not authorised to create projects here"
        :description="`This portal is a read-only snapshot. Download the file and add it to data/workflows/projects/${id}.yaml in a pull request.`"
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
