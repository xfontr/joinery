<template>
    <NuxtLayout>
        <section
            :data-error="isNotFound ? 'not-found' : 'server'"
            class="flex h-[calc(70vh-2*var(--spacing-m))] flex-col items-center justify-center gap-m"
        >
            <h1 class="text-status font-black">{{ error.status }}</h1>
            <p class="text-center text-l">
                {{ $t(isNotFound ? "error.notFound" : "error.server") }}
            </p>
            <p class="text-m">{{ $t("error.cta") }}</p>
            <button v-if="!isNotFound" type="button" @click="reloadNuxtApp({ force: true })">
                [ {{ $t("error.retry") }} ]
            </button>
            <NuxtLink to="/" class="mt-m">[ {{ $t("error.home") }} ]</NuxtLink>
        </section>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import type { NuxtError } from "#app";

interface Props {
    error: NuxtError;
}

const { error } = defineProps<Props>();

const { t } = useI18n();

const isNotFound = computed(() => error.status === 404);

useHead(
    {
        title: () => t("error.head", { status: error.status }),
        meta: [{ name: "robots", content: "noindex" }],
    },
    { tagPriority: "high" },
);
</script>
