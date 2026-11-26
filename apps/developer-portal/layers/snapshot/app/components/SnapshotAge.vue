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

        <I18nT v-if="!manifest" keypath="snapshotAge.never" scope="global">
            <template #command>
                <code class="font-mono text-default">{{ COLLECT }}</code>
            </template>
        </I18nT>

        <template v-else-if="failed">
            {{ $t("snapshotAge.failed", { artifact, error: status?.error }) }}
        </template>

        <span
            v-else
            :title="$t('snapshotAge.at', { commit: manifest.commit, branch: manifest.branch })"
        >
            {{
                source
                    ? $t("snapshotAge.sourceCollected", { source, age: collected })
                    : $t("snapshotAge.collected", { age: collected })
            }}
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

const COLLECT = "pnpm exec nx collect @joinery/developer-portal";

const { t } = useI18n();

const status = computed(() => (artifact ? manifest?.artifacts[artifact] : undefined));

const failed = computed(() => status.value?.ok === false);
const collected = computed(() =>
    relativeTime(status.value?.generatedAt ?? manifest?.generatedAt, t),
);
</script>
