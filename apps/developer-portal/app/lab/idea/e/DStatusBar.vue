<template>
    <footer
        data-chrome
        class="fixed inset-x-0 bottom-0 z-20 flex h-7 items-center justify-between gap-4 px-3 font-mono text-xs text-(--chrome-muted) sm:pl-0 lg:left-60"
        aria-label="Status"
    >
        <span class="hidden h-full min-w-0 shrink-0 items-center gap-2 sm:flex">
            <template v-if="manifest">
                <span
                    class="flex h-full max-w-56 min-w-0 items-center gap-1.5 bg-(--signal) px-3 font-medium text-black"
                >
                    <UIcon name="i-lucide-git-branch" class="size-3 shrink-0" />
                    <span class="truncate">{{ manifest.branch }}</span>
                </span>
                <span>@{{ commit }}</span>
                <span class="hidden sm:inline">· collected {{ age }}</span>
            </template>
            <span v-else class="flex h-full items-center bg-(--signal) px-3 text-black"
                >never collected</span
            >
        </span>

        <ul class="flex shrink-0 items-center gap-4">
            <li
                v-for="item in signals"
                :key="item.id"
                :class="item.tone === 'bad' || item.tone === 'warn' ? 'flex' : 'hidden md:flex'"
            >
                <component
                    :is="item.to ? NuxtLink : 'span'"
                    :to="item.to ?? undefined"
                    class="flex items-baseline gap-1.5"
                    :class="item.to && 'hover:text-(--chrome-text)'"
                    :title="`${item.label}: ${item.value} ${item.detail}`"
                >
                    <span>{{ item.label }}</span>
                    <span
                        class="font-medium"
                        :class="toneClass(item.tone) || 'text-(--chrome-text)'"
                    >
                        {{ item.value }}
                    </span>
                    <span class="hidden xl:inline">{{ item.detail }}</span>
                </component>
            </li>
        </ul>
    </footer>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useSignals } from "./signals";

const { signals, manifest } = await useSignals();

const age = computed(() => relativeTime(manifest.value?.generatedAt));
const commit = computed(() => manifest.value?.commit.slice(0, 7) ?? "");
</script>
