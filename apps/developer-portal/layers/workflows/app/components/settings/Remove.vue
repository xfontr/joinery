<template>
    <section class="grid gap-4 border-t border-default pt-8 md:grid-cols-3">
        <header>
            <h2 class="font-semibold">{{ $t("settingsRemove.title") }}</h2>
            <p class="text-sm text-muted">{{ $t("settingsRemove.rarely") }}</p>
        </header>
        <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-default p-4 md:col-span-2"
        >
            <I18nT keypath="settingsRemove.lead" tag="p" scope="global" class="text-sm text-muted">
                <template #command>
                    <code>{{ drop }}</code>
                </template>
            </I18nT>
            <UButton
                :label="$t('settingsRemove.deleteOpen')"
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
        :title="$t('settingsRemove.modal.title', { title })"
        :description="$t('settingsRemove.modal.description')"
    >
        <template #body>
            <I18nT
                v-if="dropping.close > 0"
                keypath="settingsRemove.drop"
                tag="p"
                scope="global"
                class="mb-4 text-sm text-muted"
            >
                <template #close>{{ dropping.close }}</template>
                <template #keep>{{ dropping.keep }}</template>
                <template #command>
                    <code>{{ dropYes }}</code>
                </template>
            </I18nT>
            <UFormField :label="$t('settingsRemove.confirm', { project })">
                <UInput v-model="confirmation" class="w-full" autofocus />
            </UFormField>
        </template>
        <template #footer>
            <div class="flex w-full justify-end gap-2">
                <UButton
                    :label="$t('settingsRemove.cancel')"
                    color="neutral"
                    variant="ghost"
                    @click="deleting = false"
                />
                <UButton
                    :label="$t('settingsRemove.delete')"
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

const drop = computed(() => `pnpm workflow:drop ${project}`);
const dropYes = computed(() => `${drop.value} --yes`);

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
