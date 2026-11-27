<template>
    <WidgetPanel :title="$t('healthLines.title')" to="/coverage">
        <dl class="divide-y divide-default">
            <div
                v-for="line in rows"
                :key="line.label"
                class="group relative flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 px-4 py-3"
            >
                <dt class="text-sm text-toned group-hover:text-highlighted">
                    <!-- Stretched over the row, so the bar clicks through too -->
                    <NuxtLink :to="line.to" class="after:absolute after:inset-0">
                        {{ line.label }}
                    </NuxtLink>
                </dt>
                <dd data-figure class="text-xl leading-none" :class="line.figureClass">
                    {{ line.value }}
                </dd>
                <dd v-if="line.parts.length" class="flex basis-full flex-col gap-2">
                    <SplitBar :parts="line.parts" :legend="line.legend" />
                </dd>
            </div>
        </dl>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { HealthLine } from "~/types/HealthLine";

interface Props {
    lines: HealthLine[];
}

const { lines } = defineProps<Props>();

const rows = computed(() =>
    lines.map((line) => ({ ...line, figureClass: toneClass(line.tone) || "text-highlighted" })),
);
</script>
