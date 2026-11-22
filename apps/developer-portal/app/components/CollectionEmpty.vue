<template>
    <div class="p-12 text-center">
        <UIcon :name="icon" class="mx-auto mb-2 size-8 text-dimmed" />
        <p class="text-sm text-muted">
            Nothing {{ collected ? "collected " : "" }}under
            <code class="font-mono">{{ folder }}</code> yet.
        </p>
        <p class="mt-1 text-xs text-dimmed">
            The <code class="font-mono">{{ skill }}</code> skill writes {{ each
            }}<template v-if="collected"
                >;
                <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>
                is what reads them in</template
            >.
        </p>
    </div>
</template>

<script setup lang="ts">
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

const { icon, folder, skill, each, collected = true } = defineProps<Props>();
</script>
