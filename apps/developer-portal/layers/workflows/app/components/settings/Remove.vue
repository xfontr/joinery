<template>
    <section class="grid gap-4 border-t border-default pt-8 md:grid-cols-3">
        <header>
            <h2 class="font-semibold">Remove</h2>
            <p class="text-sm text-muted">Rarely needed.</p>
        </header>
        <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-default p-4 md:col-span-2"
        >
            <p class="text-sm text-muted">
                Removes the project file and its snapshot. Run
                <code>pnpm workflow:drop {{ project }}</code> first to close the tickets nobody
                started; the rest stay on GitHub.
            </p>
            <UButton
                label="Delete project…"
                icon="i-lucide-trash-2"
                color="error"
                variant="soft"
                size="sm"
                @click="deleting = true"
            />
        </div>
    </section>

    <UModal
        v-model:open="deleting"
        :title="`Delete ${title}?`"
        description="The project file and its snapshot go. Deleting closes nothing on GitHub."
    >
        <template #body>
            <p v-if="dropping.close > 0" class="mb-4 text-sm text-muted">
                As of the last sync, {{ dropping.close }} tickets are untouched and
                {{ dropping.keep }} already started or closed. Close the untouched ones first with
                <code>pnpm workflow:drop {{ project }} --yes</code>, since it reads the milestone
                from this project file.
            </p>
            <UFormField :label="`Type ${project} to confirm`">
                <UInput v-model="confirmation" class="w-full" autofocus />
            </UFormField>
        </template>
        <template #footer>
            <div class="flex w-full justify-end gap-2">
                <UButton label="Cancel" color="neutral" variant="ghost" @click="deleting = false" />
                <UButton
                    label="Delete project"
                    icon="i-lucide-trash-2"
                    color="error"
                    :disabled="confirmation !== project"
                    @click="emit('remove')"
                />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { dropPlan, type SnapshotIssue } from "#layers/workflows/shared/workflows.ts";

interface Props {
    project: string;
    title: string;
    /** The tickets as of the last sync, which decide what `workflow:drop` would close. */
    issues: SnapshotIssue[];
}

const { project, title, issues } = defineProps<Props>();
const emit = defineEmits<{ remove: [] }>();

const dropping = computed(() => {
    const { close, keep } = dropPlan(issues);
    return { close: close.length, keep: keep.length };
});

const deleting = ref(false);
const confirmation = ref("");
watch(deleting, () => {
    confirmation.value = "";
});
</script>
