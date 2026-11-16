<template>
    <section id="contacto" class="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div
            class="grid overflow-hidden rounded-3xl bg-elevated shadow-xl lg:grid-cols-[1fr_1.4fr]"
        >
            <div data-dark class="flex flex-col justify-between gap-12 p-8 md:p-12">
                <div class="flex flex-col gap-5">
                    <h2 class="text-5xl leading-none text-highlighted md:text-6xl">
                        Empecemos por <em>hablar</em>
                    </h2>
                    <p class="text-lg">
                        Cuéntame qué te trae. Con tu nombre y un teléfono o un email basta, y lo que
                        me escribas es confidencial.
                    </p>
                </div>
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <UButton
                            :href="contact.whatsapp"
                            color="neutral"
                            size="lg"
                            label="Escribir por WhatsApp"
                            class="justify-center rounded-full"
                        />
                        <a
                            :href="contact.phoneHref"
                            class="py-2 text-center text-base text-highlighted underline underline-offset-4"
                        >
                            o llama al {{ contact.phone }}
                        </a>
                    </div>
                    <p class="text-base">
                        {{ contact.address }}, {{ contact.city }} ·
                        <a :href="mapsUrl" class="text-highlighted underline underline-offset-4"
                            >Cómo llegar</a
                        >
                    </p>
                </div>
            </div>
            <div class="p-8 md:p-12">
                <LabForm :topics="concernTopics" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { concernTopics, contact, mapsUrl } from "../fixtures";
</script>
