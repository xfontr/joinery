// A plugin rather than `app.vue`, because `error.vue` renders in its place.
export default defineNuxtPlugin(() => {
    const { localeProperties } = useNuxtApp().$i18n;

    useHead({ htmlAttrs: { lang: () => localeProperties.value.language } });
});
