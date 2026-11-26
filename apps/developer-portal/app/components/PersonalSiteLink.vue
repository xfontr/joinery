<template>
    <NuxtLink
        data-view-switch
        :to="personalSite"
        class="flex h-11 items-center justify-center border-b border-default text-sm text-highlighted hover:bg-elevated"
        :aria-label="collapsed ? $t('app.dev.visitorSwitch') : undefined"
        :title="collapsed ? $t('app.dev.visitorSwitchTitle') : undefined"
    >
        <UIcon v-if="collapsed" name="i-lucide-arrow-left-right" class="size-4 text-muted" />
        <template v-else>{{ $t("personalSiteLink") }}</template>
    </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
    collapsed?: boolean;
}

defineProps<Props>();

const { personalSite } = useAppConfig();
</script>
