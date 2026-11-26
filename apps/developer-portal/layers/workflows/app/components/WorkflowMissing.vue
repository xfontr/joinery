<template>
    <EmptyState>
        <I18nT keypath="workflows.missing" scope="global">
            <template #id>
                <code class="font-mono">{{ id }}</code>
            </template>
            <template #folder>
                <code class="font-mono">{{ FOLDER }}</code>
            </template>
        </I18nT>
    </EmptyState>
</template>

<script setup lang="ts">
interface Props {
    /** The project id the route asked for. */
    id: string;
}

const { id } = defineProps<Props>();

const FOLDER = "data/workflows/projects/";
</script>
