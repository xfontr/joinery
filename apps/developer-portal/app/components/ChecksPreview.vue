<template>
    <ul class="flex flex-col">
        <li
            v-for="row in rows"
            :key="row.id"
            class="flex items-center gap-3 border-t border-default py-2 first:border-t-0"
        >
            <UIcon name="i-lucide-check" class="tone-good size-4 shrink-0" />
            <span class="flex-1 font-mono text-xs text-muted uppercase">
                {{ $t(`method.prove.checks.${row.id}.area`) }}
            </span>
            <span class="text-sm text-highlighted">{{ row.figure }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
interface Props {
    /** Spec files across the repo; `null` when nothing was collected. */
    specs: number | null;
    rules: { enabled: number; inHouse: number } | null;
}

const { specs, rules } = defineProps<Props>();

const { t } = useI18n();

const rows = computed(() => [
    {
        id: "tests",
        figure: specs
            ? t("checksPreview.tests.count", { count: specs })
            : t("checksPreview.tests.none"),
    },
    { id: "accessibility", figure: t("checksPreview.accessibility") },
    {
        id: "lint",
        figure: rules
            ? t("checksPreview.lint.count", { count: rules.enabled })
            : t("checksPreview.lint.none"),
    },
]);
</script>
