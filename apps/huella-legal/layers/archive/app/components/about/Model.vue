<template>
    <section class="border-t border-default bg-muted">
        <UContainer class="py-16 lg:py-24">
            <BaseSectionHeading :kicker="$t('aboutModel.kicker')" :title="$t('aboutModel.title')" />
            <ul class="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
                <UPageFeature
                    v-for="(item, index) in MODEL"
                    :key="item.key"
                    as="li"
                    :description="$t(`aboutModel.${item.key}.body`)"
                    :style="{ '--step': index }"
                    :ui="{
                        root: 'hl-about-reveal flex flex-col gap-4',
                        leading: 'mb-0 w-full gap-4',
                        description: 'mt-4 max-w-sm',
                    }"
                >
                    <template #leading>
                        <span
                            class="grid size-14 shrink-0 place-items-center rounded-full bg-secondary-600 text-inverted"
                        >
                            <UIcon :name="item.icon" class="size-7" />
                        </span>
                        <span class="h-px flex-1 bg-secondary-200" aria-hidden="true" />
                    </template>
                    <template #title>
                        <h3 class="text-card">
                            {{ $t(`aboutModel.${item.key}.title`) }}
                        </h3>
                    </template>
                </UPageFeature>
            </ul>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
const MODEL = [
    { key: "freeToRead", icon: "i-lucide-lock-open" },
    { key: "openToWriters", icon: "i-lucide-pen-line" },
    { key: "independent", icon: "i-lucide-heart-handshake" },
] as const;
</script>
