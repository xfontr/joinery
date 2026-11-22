<template>
    <nav
        :aria-label="$t('subjectsSectionNav.label')"
        class="mt-5 -ml-3 flex flex-wrap font-sans text-sm font-semibold"
    >
        <ULink
            v-for="(hash, key) in SECTIONS"
            :key
            raw
            :to="{ hash }"
            class="inline-flex min-h-11 items-center px-3 text-primary underline-offset-4 hover:underline focus-visible:rounded-xs"
            >{{
                $t(`subjectsSectionNav.${key}`, { count: index[key].length }, index[key].length)
            }}</ULink
        >
    </nav>
</template>

<script setup lang="ts">
interface Props {
    index: SubjectIndex;
}

defineProps<Props>();

const SECTIONS = { subjects: "#areas", formats: "#formatos", topics: "#temas" } as const;
</script>
