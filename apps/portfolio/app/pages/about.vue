<template>
    <PageHero :title="$t('about.title')" :mark="$t('about.titleMark')" :lead="$t('about.lead')" />

    <UContainer as="section" class="page-grid gap-y-8 border-t border-accented pt-6">
        <p class="col-span-4 text-lead text-highlighted md:col-span-7">
            {{ $t("about.intro.start") }}
            <ULink :to="portal" raw class="link">{{ $t("about.developerView") }}</ULink>
            {{ $t("about.intro.middle") }}
            <ULink :to="SPOTIFY_POST" target="_blank" raw class="link">{{
                $t("about.post")
            }}</ULink>
            {{ $t("about.intro.end") }}
        </p>
        <ul class="col-span-4 md:col-span-3 md:col-start-10">
            <li
                v-for="link in links"
                :key="link.to"
                class="border-t border-default first:max-md:border-t-0"
            >
                <ULink
                    :to="link.to"
                    target="_blank"
                    class="flex justify-between py-2.5 text-base text-highlighted hover:text-primary"
                >
                    {{ link.label }} <span aria-hidden="true">↗</span>
                </ULink>
            </li>
        </ul>
    </UContainer>

    <UContainer as="section" class="pt-32">
        <h2 class="pb-10 text-section text-highlighted">{{ $t("about.story.label") }}</h2>
        <TermList :items="story" ordered class="border-b border-default" />
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
    apps: { "Huella Legal": "/work/huella-legal" },
} as const satisfies Record<(typeof STORY)[number], Record<string, string>>;

const portal = portalUrl("/");

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
