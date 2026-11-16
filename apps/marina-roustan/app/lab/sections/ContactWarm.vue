<template>
    <section id="contacto" class="bg-elevated">
        <div class="mx-auto flex max-w-3xl flex-col gap-12 px-5 py-24 md:py-32">
            <div class="flex flex-col items-center gap-5 text-center">
                <h2 class="text-5xl text-highlighted md:text-7xl">Escríbeme</h2>
                <p class="max-w-md text-xl">
                    Cuéntame qué te trae. Con tu nombre y un teléfono o un email basta, y lo que me
                    escribas es confidencial.
                </p>
            </div>
            <LabForm :topics="concernTopics" />
            <div class="flex flex-col gap-6 border-t border-default pt-10">
                <p class="text-center text-base text-muted">¿Prefieres hablar directamente?</p>
                <div class="grid gap-3 sm:grid-cols-3">
                    <UButton
                        :href="contact.phoneHref"
                        color="neutral"
                        variant="outline"
                        size="xl"
                        :label="`Llamar al ${contact.phone}`"
                        class="justify-center rounded-full"
                    />
                    <UButton
                        :href="contact.whatsapp"
                        target="_blank"
                        color="neutral"
                        variant="outline"
                        size="xl"
                        label="WhatsApp"
                        class="justify-center rounded-full"
                    />
                    <UButton
                        :href="mapsUrl"
                        target="_blank"
                        color="neutral"
                        variant="outline"
                        size="xl"
                        label="Cómo llegar"
                        class="justify-center rounded-full"
                    />
                </div>
                <p class="text-center text-base">
                    Consulta en {{ contact.address }}, {{ contact.city }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { concernTopics, contact, mapsUrl } from "../fixtures";
</script>
