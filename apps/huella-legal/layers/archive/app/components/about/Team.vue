<template>
    <UPageSection
        orientation="horizontal"
        :title="$t('aboutTeam.title')"
        :ui="{ container: 'lg:items-start', wrapper: 'lg:col-span-5' }"
    >
        <template #headline>
            <BaseKicker>{{ $t("aboutTeam.kicker") }}</BaseKicker>
        </template>
        <div class="hl-about-reveal flex flex-col gap-6 lg:col-span-7">
            <p class="max-w-measure font-serif text-reading text-toned">
                {{ $t("aboutTeam.lead") }}
            </p>
            <UButton
                variant="outline"
                color="neutral"
                :label="$t('aboutTeam.action')"
                trailing-icon="i-lucide-arrow-right"
                :to="{ name: 'authors' }"
                class="self-start"
            />
        </div>
    </UPageSection>
</template>
