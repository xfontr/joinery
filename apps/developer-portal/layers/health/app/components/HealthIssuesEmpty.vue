<template>
    <div class="p-12 text-center">
        <UIcon name="i-lucide-circle-dot" class="mx-auto mb-2 size-8 text-dimmed" />
        <p class="text-sm text-muted">
            {{ none ? $t("issues.empty") : $t("issues.noMatch") }}
        </p>
        <I18nT
            v-if="none && !failed"
            keypath="issues.file"
            tag="p"
            scope="global"
            class="mt-1 text-xs text-dimmed"
        >
            <template #command>
                <code class="font-mono">{{ ADD }}</code>
            </template>
        </I18nT>
    </div>
</template>

<script setup lang="ts">
interface Props {
    /** No issue was read at all, rather than none matching the filter. */
    none: boolean;
    failed: boolean;
}

const { none, failed } = defineProps<Props>();

const ADD = "pnpm issue:add";
</script>
