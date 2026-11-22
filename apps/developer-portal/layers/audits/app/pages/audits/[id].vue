<template>
    <UDashboardPanel id="audit">
        <template #header>
            <PageHeader
                :crumbs="[{ label: $t('audit.crumb'), to: '/audits' }]"
                :title="report?.title ?? page?.title ?? $t('audit.notFound')"
            >
                <template #actions>
                    <StatusPill v-if="state" :label="state.label" :tone="state.tone" />
                    <I18nT
                        v-if="report?.commit"
                        keypath="audit.readAt"
                        tag="span"
                        scope="global"
                        class="text-xs text-muted"
                    >
                        <template #commit>
                            <code class="font-mono">{{ report.commit }}</code>
                        </template>
                    </I18nT>
                    <code class="font-mono text-xs text-dimmed">{{ source }}</code>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex items-start gap-6">
                <div class="flex min-w-0 flex-1 flex-col gap-4">
                    <UBreadcrumb :items="crumbs" />

                    <UAlert
                        v-if="!page"
                        color="neutral"
                        variant="subtle"
                        icon="i-lucide-file-question"
                        :title="$t('audit.missing.title')"
                        :description="$t('audit.missing.description', { id })"
                    />

                    <template v-else>
                        <div v-if="report" class="grid grid-cols-3 gap-3">
                            <StatTile
                                v-for="status in FINDING_STATUSES"
                                :key="status"
                                :label="$t(`audits.findingStatus.${status}`)"
                                :value="report.counts[status]"
                                :tone="findingStatusTone(status)"
                            />
                        </div>

                        <UPageBody class="mt-0">
                            <ContentRenderer :value="page" />
                        </UPageBody>
                    </template>
                </div>

                <aside
                    v-if="page?.body?.toc?.links?.length"
                    class="sticky top-0 hidden w-56 shrink-0 xl:block"
                >
                    <UContentToc :links="page.body.toc.links" highlight class="bg-transparent" />
                </aside>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { FINDING_STATUSES } from "#layers/snapshot/shared/audits.ts";

const route = useRoute();
const { t } = useI18n();

const reports = useAuditReports();

const id = computed(() => (route.params.id as string | undefined) ?? "");
const path = computed(() => `/docs/audits/${id.value}`);

const { data: page } = await useAsyncData(
    () => `audit-${id.value}`,
    () => queryCollection("docs").path(path.value).first(),
    { watch: [path] },
);

const report = computed(() => reports.value.find((candidate) => candidate.id === id.value) ?? null);

const state = computed(
    () =>
        report.value && {
            label: t(`audits.state.${report.value.state}`),
            tone: auditStateTone(report.value.state),
        },
);

const source = computed(() => report.value?.path ?? `${path.value.slice(1)}.md`);

const crumbs = computed<BreadcrumbItem[]>(() => [
    { label: t("audits.title"), to: "/audits", icon: "i-lucide-scan-search" },
    { label: report.value?.date ?? id.value, class: "font-mono" },
]);
</script>
