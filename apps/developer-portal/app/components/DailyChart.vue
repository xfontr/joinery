<template>
    <figure class="m-0">
        <div class="flex gap-2">
            <div
                class="relative w-8 shrink-0 font-mono text-xs text-muted tabular-nums"
                aria-hidden="true"
            >
                <span class="absolute top-0 right-0 -translate-y-1/2">{{ top }}</span>
                <span class="absolute top-1/2 right-0 -translate-y-1/2">{{ top / 2 }}</span>
                <span class="absolute right-0 bottom-0 translate-y-1/2">0</span>
            </div>

            <div class="relative h-48 min-w-0 flex-1" @mouseleave="hovered = null">
                <div class="absolute inset-x-0 top-0 border-t border-dashed border-default" />
                <div class="absolute inset-x-0 top-1/2 border-t border-dashed border-default" />

                <div class="absolute inset-0 flex items-end gap-px sm:gap-0.5">
                    <div
                        v-for="bar in bars"
                        :key="bar.day"
                        class="flex h-full min-w-0 flex-1 items-end"
                        @mouseenter="hovered = bar.index"
                    >
                        <div
                            class="w-full"
                            :class="
                                hovered === null || hovered === bar.index
                                    ? 'bg-inverted'
                                    : 'bg-accented'
                            "
                            :style="{ height: bar.height }"
                        />
                    </div>
                </div>

                <div class="absolute inset-x-0 bottom-0 border-t border-accented" />

                <div
                    v-if="tip"
                    class="pointer-events-none absolute top-0 z-10 border border-default bg-default px-2.5 py-1.5 text-xs whitespace-nowrap shadow-sm"
                    :class="tip.flip && '-translate-x-full'"
                    :style="{ left: tip.left }"
                    role="status"
                >
                    <p class="text-muted">{{ tip.day }}</p>
                    <p>
                        <span class="font-mono font-medium text-highlighted">{{ tip.value }}</span>
                        {{ unit }}
                    </p>
                </div>
            </div>

            <div class="relative h-48 w-14 shrink-0 text-xs text-muted">
                <p
                    class="absolute left-0 flex translate-y-1/2 flex-col"
                    :style="{ bottom: lastBottom }"
                >
                    <span class="font-mono font-medium text-highlighted">{{ last }}</span>
                    <span>{{ endLabel }}</span>
                </p>
            </div>
        </div>

        <div class="mt-1.5 ml-10 flex justify-between font-mono text-xs text-muted">
            <span>{{ firstDay }}</span>
            <span class="mr-16">{{ lastDay }}</span>
        </div>
    </figure>
</template>

<script setup lang="ts">
interface Props {
    /** `YYYY-MM-DD`, one per value. */
    days: string[];
    values: number[];
    unit: string;
    endLabel: string;
}

const { days, values, unit, endLabel } = defineProps<Props>();

const hovered = ref<number | null>(null);

const top = computed(() => {
    const max = Math.max(1, ...values);
    const magnitude = 10 ** Math.floor(Math.log10(max));
    const step = magnitude >= 10 ? magnitude / 5 : 1;

    // An even multiple, so the midline label is a whole number.
    return Math.ceil(max / (2 * step)) * 2 * step;
});

const bars = computed(() =>
    values.map((value, index) => ({
        index,
        day: days[index] ?? String(index),
        height: `${(value / top.value) * 100}%`,
    })),
);

const last = computed(() => values.at(-1) ?? 0);
const lastBottom = computed(() => `${(last.value / top.value) * 100}%`);
const firstDay = computed(() => (days[0] ? calendarDay(days[0]) : ""));
const lastDay = computed(() => (days.at(-1) ? calendarDay(days.at(-1)!) : ""));

const tip = computed(() => {
    const index = hovered.value;
    if (index === null) return null;

    return {
        day: calendarDay(days[index] ?? ""),
        value: values[index] ?? 0,
        left: `${((index + 0.5) / values.length) * 100}%`,
        flip: index > values.length / 2,
    };
});
</script>
