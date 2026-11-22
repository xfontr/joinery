<template>
    <section class="error__debug">
        <details v-if="error.data?.message" open>
            <summary>{{ $t("errorDebug.message") }}</summary>
            <p>{{ error.data.message }}</p>
        </details>

        <details v-if="error.data">
            <summary>{{ $t("errorDebug.data") }}</summary>
            <p>{{ error.data }}</p>
        </details>

        <details>
            <summary>{{ $t("errorDebug.stack") }}</summary>
            <pre>{{ error.stack }}</pre>
        </details>
    </section>
</template>

<script lang="ts" setup>
import type { NuxtError } from "#app";

interface Props {
    error: NuxtError<{ message?: string }>;
}

const { error } = defineProps<Props>();
</script>
