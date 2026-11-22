<template>
    <UContainer as="section" :aria-label="$t('directoryPrinciples.label')" class="py-16 lg:py-20">
        <ol class="grid gap-x-10 gap-y-8 lg:grid-cols-3">
            <li v-for="(key, index) in PRINCIPLES" :key class="border-t-2 border-inverted pt-4">
                <span
                    class="font-serif text-2xl leading-none text-secondary tabular-nums"
                    aria-hidden="true"
                    >{{ index + 1 }}</span
                >
                <h2 class="mt-3 font-serif text-h3 text-highlighted">
                    {{ $t(`directoryPrinciples.${key}.title`) }}
                </h2>
                <p class="mt-2 font-serif text-base/relaxed text-toned">
                    {{ $t(`directoryPrinciples.${key}.body`) }}
                </p>
            </li>
        </ol>
    </UContainer>
</template>

<script setup lang="ts">
const PRINCIPLES = ["rigour", "accessibility", "openAccess"] as const;
</script>
