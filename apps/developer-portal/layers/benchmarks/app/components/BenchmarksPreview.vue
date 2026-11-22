<template>
    <div class="relative h-32">
        <img
            v-for="(item, index) in fanned"
            :key="item.id"
            :src="screenshotOf(item)"
            alt=""
            class="absolute inset-x-6 top-2 aspect-video border border-default bg-default object-cover object-top shadow-md"
            :class="FAN[index]"
        />
    </div>
</template>

<script setup lang="ts">
import { screenshotOf } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";

interface Props {
    benchmarks: readonly Benchmark[];
}

const { benchmarks } = defineProps<Props>();

const FAN = ["-translate-x-4 -rotate-6", "translate-x-4 rotate-6", "translate-y-2"] as const;

const fanned = computed(() => benchmarks.slice(0, FAN.length));
</script>
