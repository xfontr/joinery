export default defineNuxtPlugin((nuxtApp) => {
    const root = document.documentElement;

    nuxtApp.hook("page:view-transition:start", (transition) => {
        root.dataset.pageTransition = "rise";

        void transition.finished.finally(() => {
            delete root.dataset.pageTransition;
        });
    });
});
