<template>
    <UContainer>
        <div
            class="flex flex-col gap-4 border-b border-default pt-10 pb-8 md:pt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-10"
        >
            <I18nT
                keypath="homeHero.title"
                tag="h1"
                scope="global"
                class="max-w-3xl font-serif text-display-sm text-balance text-highlighted md:text-display lg:text-display-lg"
            >
                <template #emphasis>
                    <em class="text-primary">{{ $t("homeHero.emphasis") }}</em>
                </template>
            </I18nT>
            <p class="max-w-sm font-serif text-base/relaxed text-muted lg:pb-2 lg:text-right">
                {{ $t("homeHero.lead") }}
            </p>
        </div>
    </UContainer>
</template>
