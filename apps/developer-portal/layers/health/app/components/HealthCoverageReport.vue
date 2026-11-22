<template>
    <WidgetPanel
        title="Line-by-line report"
        meta="The merged report pnpm test:coverage renders, copied in by the collector"
    >
        <template v-if="copied">
            <div class="flex justify-end border-b border-default px-4 py-2">
                <UButton
                    :to="src"
                    target="_blank"
                    external
                    label="Open full"
                    icon="i-lucide-external-link"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                />
            </div>
            <iframe :src class="embedded-report h-160" title="Coverage report" />
        </template>
        <EmptyState v-else>
            No HTML report copied in. Run
            <code class="font-mono">pnpm test:coverage</code> from the workspace root, then
            <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>.
        </EmptyState>
    </WidgetPanel>
</template>

<script setup lang="ts">
interface Props {
    /** Whether the collector copied the merged HTML report in. */
    copied: boolean;
}

const { copied } = defineProps<Props>();

const src = embedUrl("/embed/coverage/index.html");
</script>
