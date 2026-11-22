<template>
    <UContainer as="section" :aria-label="$t('homePublishPrompt.label')" class="py-16 lg:py-20">
        <div
            class="flex flex-col gap-4 border-t-2 border-inverted pt-5 md:flex-row md:items-center md:justify-between md:gap-10"
        >
            <p class="max-w-3xl font-serif text-xl/snug text-highlighted md:text-h3">
                {{ $t("homePublishPrompt.prompt") }}
            </p>
            <UButton
                variant="outline"
                color="neutral"
                :label="$t('homePublishPrompt.action')"
                trailing-icon="i-lucide-arrow-right"
                :to="{ name: 'publish' }"
                class="shrink-0 self-start md:self-auto"
            />
        </div>
    </UContainer>
</template>
