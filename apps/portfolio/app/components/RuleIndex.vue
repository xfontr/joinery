<template>
    <nav :aria-label="$t('method.head')" class="hidden md:col-span-3 md:block">
        <ol class="sticky top-8 flex flex-col gap-2.5 pt-8">
            <li v-for="(id, index) in RULES" :key="id">
                <a
                    :href="`#${id}`"
                    class="flex gap-3 text-base"
                    :class="
                        active === id ? 'text-highlighted' : 'text-muted hover:text-highlighted'
                    "
                    :aria-current="active === id || undefined"
                >
                    <span
                        class="pt-0.5 font-mono text-meta"
                        :class="active === id && 'text-primary'"
                    >
                        0{{ index + 1 }}
                    </span>
                    <span>{{ $t(`rules.${id}.title`) }}</span>
                </a>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import type { RuleId } from "~/types/RuleId";

/** The rule whose section crosses the upper third of the screen. */
const active = ref<RuleId>(RULES[0]);

const sections = ref<HTMLElement[]>([]);

onMounted(() => {
    sections.value = RULES.flatMap((id) => document.getElementById(id) ?? []);
});

useIntersectionObserver(
    sections,
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) active.value = entry.target.id as RuleId;
        }
    },
    { rootMargin: "-25% 0px -65% 0px" },
);
</script>
