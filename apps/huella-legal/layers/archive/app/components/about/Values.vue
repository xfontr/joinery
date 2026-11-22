<template>
    <UContainer as="section" class="py-16 lg:py-24">
        <BaseSectionHeading :kicker="$t('aboutValues.kicker')" :title="$t('aboutValues.title')" />
        <ul class="mt-10 grid gap-5 md:grid-cols-3">
            <UPageFeature
                v-for="(value, index) in VALUES"
                :key="value.key"
                as="li"
                :icon="value.icon"
                :description="$t(`aboutValues.${value.key}.body`)"
                :style="{ '--step': index }"
                :ui="{
                    root: 'hl-about-reveal flex flex-col gap-4 bg-muted p-6 ring-1 ring-muted',
                    leading: 'mb-0 size-12 rounded-full bg-secondary-50 ring-1 ring-secondary-100',
                    leadingIcon: 'size-6',
                    description: 'mt-4',
                }"
            >
                <template #title>
                    <h3 class="text-card">
                        {{ $t(`aboutValues.${value.key}.title`) }}
                    </h3>
                </template>
            </UPageFeature>
        </ul>
    </UContainer>
</template>

<script setup lang="ts">
const VALUES = [
    { key: "rigour", icon: "i-lucide-scale" },
    { key: "clarity", icon: "i-lucide-book-open" },
    { key: "usefulness", icon: "i-lucide-graduation-cap" },
] as const;
</script>
