<template>
    <!-- eslint-disable-next-line vue/no-v-html -- the HTML is lab fixture text from this repo, not user input -->
    <div :class="$style.prose" v-html="html" />
</template>

<script setup lang="ts">
interface Props {
    html: string;
}

defineProps<Props>();
</script>

<style module>
.prose {
    color: var(--ui-text);
    font-size: 1.125rem;
    font-weight: 300;
    line-height: 1.7;
}

@media (min-width: 768px) {
    .prose {
        font-size: var(--text-body);
        line-height: var(--text-body--line-height);
    }
}

.prose > * + * {
    margin-top: 1em;
}

.prose h2,
.prose h3,
.prose h4 {
    color: var(--ui-text-highlighted);
    font-weight: 700;
    line-height: 1.2;
    margin-top: 1.8em;
}

.prose h2 {
    font-size: 1.75rem;
}

.prose h3 {
    font-size: var(--text-h3);
}

.prose h2 + *,
.prose h3 + * {
    margin-top: 0.5em;
}

.prose a {
    color: var(--ui-primary);
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.prose strong {
    font-weight: 700;
}

.prose ol,
.prose ul {
    padding-left: 1.4em;
}

.prose ol {
    list-style: decimal;
}

.prose ul {
    list-style: disc;
}

.prose li + li {
    margin-top: 0.35em;
}

.prose blockquote {
    border-left: 3px solid var(--ui-secondary);
    padding-left: 1em;
    font-style: italic;
}
</style>
