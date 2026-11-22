<template>
    <footer
        class="absolute inset-x-0 bottom-0 z-40 flex h-7 items-center justify-between gap-4 border-t border-default pr-3 font-mono text-xs surface-ink text-muted"
        :aria-label="$t('statusBar.label')"
    >
        <p class="flex h-full min-w-0 items-center gap-2">
            <span
                class="flex h-full max-w-56 min-w-0 items-center gap-1.5 bg-primary px-3 font-medium text-inverted"
            >
                <UIcon name="i-lucide-git-branch" class="size-3 shrink-0" />
                <span class="truncate">{{
                    collected?.branch ?? $t("statusBar.neverCollected")
                }}</span>
            </span>
            <span v-if="collected" class="hidden truncate sm:inline">
                {{ provenance }}
            </span>
        </p>

        <ul class="flex shrink-0 items-center gap-4">
            <li
                v-for="item in items"
                :key="item.id"
                :class="item.tone === 'bad' || item.tone === 'warn' ? 'flex' : 'hidden md:flex'"
            >
                <NuxtLink
                    :to="item.to"
                    class="flex items-baseline gap-1.5 hover:text-highlighted"
                    :title="
                        $t('statusBar.title', {
                            label: item.label,
                            value: item.value,
                            detail: item.detail,
                        })
                    "
                >
                    <span>{{ item.label }}</span>
                    <span class="font-medium" :class="toneClass(item.tone) || 'text-highlighted'">
                        {{ item.value }}
                    </span>
                    <span class="hidden xl:inline">{{ item.detail }}</span>
                </NuxtLink>
            </li>
        </ul>
    </footer>
</template>

<script setup lang="ts">
import type { StatusItem } from "~/types/StatusItem";

interface Props {
    collected: { branch: string; commit: string; at: string } | null;
    items: StatusItem[];
}

const { collected, items } = defineProps<Props>();

const { t } = useI18n();

const provenance = computed(() =>
    collected
        ? t("statusBar.collected", {
              commit: collected.commit.slice(0, 7),
              age: relativeTime(collected.at, t),
          })
        : "",
);
</script>
