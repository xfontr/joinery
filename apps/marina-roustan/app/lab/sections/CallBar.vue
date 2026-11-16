<template>
    <div class="h-20 md:hidden" aria-hidden="true" />
    <nav
        aria-label="Contactar"
        class="fixed inset-x-0 bottom-0 z-10 grid grid-cols-3 gap-2 border-t border-default bg-default p-3 transition md:hidden"
        :class="shown ? 'translate-y-0' : 'translate-y-full'"
    >
        <UButton
            :href="contact.phoneHref"
            color="neutral"
            variant="outline"
            size="lg"
            label="Llamar"
            class="justify-center rounded-full"
        />
        <UButton
            :href="contact.whatsapp"
            color="neutral"
            variant="outline"
            size="lg"
            label="WhatsApp"
            class="justify-center rounded-full"
        />
        <UButton
            :to="`${base}/contacto`"
            color="neutral"
            size="lg"
            label="Escribir"
            class="justify-center rounded-full"
        />
    </nav>
</template>

<script setup lang="ts">
import { contact } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

const shown = ref(false);
const update = () => {
    shown.value = window.scrollY > window.innerHeight * 0.6;
};

onMounted(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", update));
</script>
