<template>
    <section class="border-y border-default bg-muted">
        <UContainer class="py-16 lg:py-24">
            <BaseSectionHeading
                :kicker="$t('aboutTopics.kicker')"
                :title="$t('aboutTopics.title')"
                :action="{ label: $t('aboutTopics.action'), to: { name: 'categories' } }"
            />
            <ul class="mt-6 divide-y divide-default">
                <UPageFeature
                    v-for="(topic, index) in TOPICS"
                    :key="topic.key"
                    as="li"
                    orientation="horizontal"
                    :icon="topic.icon"
                    :description="$t(`aboutTopics.${topic.key}.body`)"
                    :style="{ '--step': index }"
                    :ui="{
                        root: 'hl-about-reveal gap-5 py-6 md:items-center md:gap-10',
                        leading: 'mt-1 p-0 md:mt-0',
                        leadingIcon: 'size-7 md:size-8',
                        wrapper:
                            'md:grid md:flex-1 md:grid-cols-[minmax(0,18rem)_1fr] md:items-center md:gap-x-10',
                        description: 'md:mt-0',
                    }"
                >
                    <template #title>
                        <h3 class="md:text-h3">
                            {{ $t(`aboutTopics.${topic.key}.title`) }}
                        </h3>
                    </template>
                </UPageFeature>
            </ul>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
const TOPICS = [
    { key: "criminal", icon: "i-lucide-gavel" },
    { key: "fundamentalRights", icon: "i-lucide-shield-check" },
    { key: "caseLaw", icon: "i-lucide-landmark" },
    { key: "more", icon: "i-lucide-library" },
] as const;
</script>
