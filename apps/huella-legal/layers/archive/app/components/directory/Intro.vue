<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-x-12">
        <BasePageHeading
            :kicker="$t('directoryIntro.kicker')"
            :title="$t('directoryIntro.title')"
            class="lg:col-span-7"
        />
        <div
            class="flex max-w-measure flex-col gap-5 font-serif text-reading text-toned lg:col-span-5 lg:pt-10"
        >
            <p>{{ $t("directoryIntro.lead", { count }) }}</p>
            <p>{{ $t("directoryIntro.thanks") }}</p>
            <div class="flex flex-col gap-3 pt-1 sm:flex-row">
                <UButton
                    :label="$t('directoryIntro.publish')"
                    :to="{ name: 'publish' }"
                    class="justify-center"
                />
                <UButton
                    variant="outline"
                    color="neutral"
                    :label="$t('directoryIntro.contact')"
                    :to="nav.contact"
                    class="justify-center"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    count: number;
}

defineProps<Props>();

const { nav } = useAppConfig();
</script>
