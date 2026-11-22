<template>
    <div class="p-12 text-center">
        <UIcon :name="icon" class="mx-auto mb-2 size-8 text-dimmed" />
        <I18nT
            :keypath="collected ? 'collectionEmpty.nothingCollected' : 'collectionEmpty.nothing'"
            tag="p"
            scope="global"
            class="text-sm text-muted"
        >
            <template #folder>
                <code class="font-mono">{{ folder }}</code>
            </template>
        </I18nT>
        <I18nT
            keypath="collectionEmpty.writes"
            tag="p"
            scope="global"
            class="mt-1 text-xs text-dimmed"
        >
            <template #skill>
                <code class="font-mono">{{ skill }}</code>
            </template>
            <template #each>{{ each }}</template>
            <template #collect>
                <I18nT v-if="collected" keypath="collectionEmpty.collect" scope="global">
                    <template #command>
                        <code class="font-mono">{{ COLLECT }}</code>
                    </template>
                </I18nT>
            </template>
        </I18nT>
    </div>
</template>

<script setup lang="ts">
const { icon, folder, skill, each, collected = true } = defineProps<Props>();

const COLLECT = "pnpm exec nx collect @monorepo/developer-portal";

interface Props {
    icon: string;
    /** The folder the records live in, such as `docs/audits/`. */
    folder: string;
    /** The skill that writes the records. */
    skill: string;
    /** How the records are filed, such as "them, one dated file per audit". */
    each: string;
    /** False for records read straight from the content collection, which no collect step reads. */
    collected?: boolean;
}
</script>
