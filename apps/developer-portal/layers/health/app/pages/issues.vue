<template>
    <UDashboardPanel id="issues">
        <template #header>
            <PageHeader title="Work in progress">
                <template #actions>
                    <HealthIssuesRead
                        :fetched-at="issues.fetchedAt"
                        :reloading
                        @refresh="refresh"
                    />
                </template>
            </PageHeader>

            <HealthIssuesToolbar v-model:search="search" v-model:label="label" :issues="all" />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    Planned and active repository work appears here as issues from GitHub. The issue
                    read is live in your browser; the rest of this portal remains a collected
                    snapshot.
                </p>

                <UAlert
                    v-if="issues.error"
                    color="warning"
                    variant="subtle"
                    icon="i-lucide-plug-zap"
                    title="GitHub could not be reached"
                    :description="`${issues.error} — this page reads GitHub from your browser, unauthenticated, which allows 60 requests an hour per address.`"
                />

                <ListCard
                    title="Open issues"
                    note="Read live from GitHub by your own browser. Nothing is stored here — the issue is the record, and this is a window onto it."
                    :shown="visible.length"
                    :total="all.length"
                >
                    <template #empty>
                        <div class="p-12 text-center">
                            <UIcon
                                name="i-lucide-circle-dot"
                                class="mx-auto mb-2 size-8 text-dimmed"
                            />
                            <p class="text-sm text-muted">
                                {{
                                    all.length === 0
                                        ? "No open issues."
                                        : "Nothing matches that filter."
                                }}
                            </p>
                            <p
                                v-if="all.length === 0 && !issues.error"
                                class="mt-1 text-xs text-dimmed"
                            >
                                File one with <code class="font-mono">pnpm issue:add</code>.
                            </p>
                        </div>
                    </template>
                    <HealthIssueRow v-for="issue in visible" :key="issue.number" :issue />
                </ListCard>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { issues, label, search, all, visible, reloading, refresh } = useIssueList();
</script>
