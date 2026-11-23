<template>
    <PageHero :title="$t('about.title')" :mark="$t('about.titleMark')" :lead="$t('about.lead')">
        <p class="max-w-xl text-base text-muted">
            {{ $t("about.intro.start") }}
            <ULink :to="SPOTIFY_POST" target="_blank" class="underline underline-offset-4">
                {{ $t("about.post") }}
            </ULink>
            {{ $t("about.intro.end") }}
        </p>
        <div class="flex flex-wrap gap-6">
            <ULink
                v-for="link in links"
                :key="link.to"
                :to="link.to"
                target="_blank"
                class="text-base text-highlighted underline decoration-primary underline-offset-4"
            >
                {{ link.label }} ↗
            </ULink>
        </div>
    </PageHero>

    <UContainer as="section" class="pb-16">
        <h2 class="pb-6 font-mono text-xs text-muted uppercase">{{ $t("about.story.label") }}</h2>
        <TermList :items="story" ordered wide />
    </UContainer>
</template>

<script setup lang="ts">
const LINKEDIN = "https://www.linkedin.com/in/xifre/";
const GITHUB = "https://github.com/xfontr";
const SPOTIFY_POST =
    "https://portal.spotify.com/blog/portal-by-spotify-cut-my-claude-code-token-usage-by-90";
const STORY = ["playground", "tooling", "workflows", "apps"] as const;
const STORY_LINKS = {
    playground: { "Nx boundaries": portalUrl("/graph") },
    tooling: {
        "decision records (ADRs)": portalUrl("/decisions"),
        "reports its own usage": portalUrl("/telemetry"),
    },
    workflows: { "workflow templates": "/agentic-workflows" },
    apps: {},
} as const satisfies Record<(typeof STORY)[number], Record<string, string>>;

const { t } = useI18n();
useSeoMeta({ title: t("about.head"), description: t("about.lead") });

const {
    public: { repoUrl },
} = useRuntimeConfig();

const links = [
    { to: LINKEDIN, label: t("about.linkedin") },
    { to: GITHUB, label: t("about.github") },
    ...(repoUrl ? [{ to: repoUrl, label: t("about.repo") }] : []),
];

const story = STORY.map((id) => ({
    id,
    term: t(`about.story.items.${id}.term`),
    detail: t(`about.story.items.${id}.detail`),
    links: STORY_LINKS[id],
}));
</script>
