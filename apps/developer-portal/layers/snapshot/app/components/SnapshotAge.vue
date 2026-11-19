<template>
    <div class="flex items-center gap-2 text-xs text-muted">
        <UIcon
            :name="
                manifest
                    ? failed
                        ? 'i-lucide-triangle-alert'
                        : 'i-lucide-clock'
                    : 'i-lucide-circle-slash'
            "
            class="size-3.5"
            :class="failed ? 'tone-bad' : ''"
        />

        <template v-if="!manifest">
            Never collected — run
            <code class="font-mono text-default"
                >pnpm exec nx collect @monorepo/developer-portal</code
            >
        </template>

        <template v-else-if="failed">
            {{ artifact }} failed to collect: {{ status?.error }}
        </template>

        <span v-else :title="`At ${manifest.commit} on ${manifest.branch}`">
            <template v-if="source">{{ source }} · collected</template>
            <template v-else>Collected</template>
            {{ collected }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { Manifest } from "#layers/snapshot/shared/types/Manifest.ts";

interface Props {
    manifest: Manifest | null;
    artifact?: string;
    /** The command or file the figures come from, printed beside their age. */
    source?: string;
}

const { manifest, artifact, source } = defineProps<Props>();

const status = computed(() => (artifact ? manifest?.artifacts[artifact] : undefined));

/**
 * Every page that reads the snapshot shows this. A report whose age is not on the page is a report
 * that quietly starts lying — and `.report/` is gitignored, so on a fresh clone the honest answer
 * is "never collected".
 */
const failed = computed(() => status.value?.ok === false);
const collected = computed(() => relativeTime(status.value?.generatedAt ?? manifest?.generatedAt));
</script>
