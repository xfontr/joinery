<template>
    <div data-identity class="flex min-h-screen flex-col">
        <a
            href="#content"
            class="sr-only z-50 bg-primary text-sm font-semibold text-inverted focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-3"
            >{{ $t("app.skipLink") }}</a
        >

        <UContainer
            as="header"
            class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6"
        >
            <ULink to="/" class="font-display text-2xl text-highlighted italic">
                {{ $t("app.visitor.wordmark") }}
            </ULink>
            <div class="flex flex-wrap items-center gap-6">
                <nav
                    class="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm"
                    :aria-label="$t('app.visitor.navLabel')"
                >
                    <ULink
                        v-for="item in NAV"
                        :key="item.to"
                        :to="item.to"
                        active-class="text-primary"
                        :aria-current="current(item.to)"
                    >
                        {{ $t(`app.visitor.nav.${item.key}`) }}
                    </ULink>
                    <ULink to="/about" active-class="text-primary">
                        {{ $t("app.visitor.nav.about") }}
                    </ULink>
                </nav>
                <ViewSwitch current="visitor" />
            </div>
        </UContainer>

        <main id="content" tabindex="-1" class="flex-1 outline-none">
            <slot />
        </main>

        <UContainer as="footer" class="py-16">
            <ULink
                to="/overview"
                class="flex flex-col gap-2 border-t border-accented pt-8 md:flex-row md:items-baseline md:justify-between"
            >
                <span class="font-display text-heading text-highlighted">
                    {{ $t("app.visitor.footer.title") }}
                    <mark>{{ $t("app.visitor.footer.titleMark") }}</mark>
                </span>
                <span class="text-sm text-muted">{{ $t("app.visitor.footer.line") }}</span>
            </ULink>
            <p class="mt-6 flex justify-between gap-4 text-sm text-muted">
                <small>{{ $t("app.visitor.footer.copyright") }}</small>
                <small>{{ $t("app.visitor.footer.noTracking") }}</small>
            </p>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import "#layers/design/app/assets/visitor.css";

const NAV = [
    { to: "/method", key: "method" },
    { to: "/agentic-workflows", key: "workflows" },
    { to: "/work", key: "work" },
    { to: "/about", key: "about" },
] as const;

const route = useRoute();

// `ULink` sets `aria-current` only on an exact match, which would leave Work unmarked on a case study
const current = (to: string) =>
    route.path === to || route.path.startsWith(`${to}/`) ? "page" : undefined;
</script>
