<template>
    <section id="contacto" class="bg-elevated">
        <div
            class="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.3fr]"
        >
            <div class="flex flex-col gap-8">
                <h2 class="text-5xl leading-none text-highlighted md:text-7xl">
                    {{ copy.contactTitle }}
                </h2>
                <p class="max-w-sm text-xl">
                    Cuéntame qué te trae. Con tu nombre y un teléfono o un email basta.
                </p>
                <div class="flex flex-col gap-3 border-t border-default pt-8">
                    <p class="text-base text-muted">¿Prefieres hablar directamente?</p>
                    <div class="flex flex-wrap gap-2">
                        <UButton
                            :href="contact.phoneHref"
                            color="neutral"
                            variant="outline"
                            size="lg"
                            :label="`Llamar al ${contact.phone}`"
                            class="rounded-full"
                        />
                        <UButton
                            :href="contact.whatsapp"
                            color="neutral"
                            variant="outline"
                            size="lg"
                            label="WhatsApp"
                            class="rounded-full"
                        />
                    </div>
                </div>
                <p class="text-base">
                    {{ contact.address }}, {{ contact.city }} ·
                    <a :href="mapsUrl" class="underline underline-offset-4">Cómo llegar</a>
                </p>
            </div>
            <LabForm :topics="concernTopics" />
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { concernTopics, contact, copy, mapsUrl } from "../fixtures";
</script>
