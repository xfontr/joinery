<template>
    <WidgetPanel
        :title="$t('projectIssuesTab.title')"
        :meta="read ? $t('projectIssuesTab.meta', { area }) : $t('projectIssuesTab.reading')"
        :count="read ? issues.length : '—'"
    >
        <EmptyState v-if="issues.length === 0">
            {{
                read ? $t("projectIssuesTab.none", { area }) : $t("projectIssuesTab.readingIssues")
            }}
        </EmptyState>
        <ul v-else class="divide-y divide-default">
            <li v-for="issue in issues" :key="issue.number">
                <a
                    :href="issue.url"
                    target="_blank"
                    class="flex items-baseline gap-3 px-4 py-2 hover:bg-elevated"
                >
                    <span class="w-14 shrink-0 font-mono text-xs text-muted">
                        #{{ issue.number }}
                    </span>
                    <span class="min-w-0 flex-1 truncate text-sm text-highlighted">
                        {{ issue.title }}
                    </span>
                    <span class="shrink-0 font-mono text-xs text-muted">{{ issue.age }}</span>
                </a>
            </li>
        </ul>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { Issue } from "#layers/github/app/utils/issues.ts";

interface Props {
    issues: (Issue & { age: string })[];
    /** Whether GitHub has answered yet, so "none" isn't said before it has. */
    read: boolean;
    /** The label the project's issues are filed under. */
    area: string;
}

const { issues, read, area } = defineProps<Props>();
</script>
