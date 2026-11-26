<template>
    <WidgetPanel :title="$t('healthCoverageReport.title')" :meta="$t('healthCoverageReport.meta')">
        <template v-if="copied">
            <div class="flex justify-end border-b border-default px-4 py-2">
                <UButton
                    :to="src"
                    target="_blank"
                    external
                    :label="$t('healthCoverageReport.open')"
                    icon="i-lucide-external-link"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                />
            </div>
            <iframe :src class="embedded-report h-160" :title="$t('healthCoverageReport.frame')" />
        </template>
        <EmptyState v-else>
            <I18nT keypath="healthCoverageReport.empty" scope="global">
                <template #test>
                    <code class="font-mono">{{ TEST }}</code>
                </template>
                <template #collect>
                    <code class="font-mono">{{ COLLECT }}</code>
                </template>
            </I18nT>
        </EmptyState>
    </WidgetPanel>
</template>

<script setup lang="ts">
interface Props {
    /** Whether the collector copied the merged HTML report in. */
    copied: boolean;
}

const { copied } = defineProps<Props>();

const TEST = "pnpm test:coverage";
const COLLECT = "pnpm exec nx collect @joinery/developer-portal";

const src = embedUrl("/embed/coverage/index.html");
</script>
