<template>
    <div data-identity class="flex min-h-screen flex-col">
        <header
            class="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-6 md:px-10"
        >
            <ULink to="/" class="font-display text-2xl text-highlighted italic">
                {{ $t("app.visitor.wordmark") }}
            </ULink>
            <div class="flex flex-wrap items-center gap-6">
                <nav
                    class="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm"
                    :aria-label="$t('app.visitor.navLabel')"
                >
                    <ULink to="/method" active-class="text-primary">
                        {{ $t("app.visitor.nav.method") }}
                    </ULink>
                    <ULink to="/agentic-workflows" active-class="text-primary">
                        {{ $t("app.visitor.nav.workflows") }}
                    </ULink>
                    <ULink to="/work" active-class="text-primary">
                        {{ $t("app.visitor.nav.work") }}
                    </ULink>
                </nav>
                <ViewSwitch current="visitor" />
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="mx-auto w-full max-w-6xl px-4 py-16 md:px-10">
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
        </footer>
    </div>
</template>
