<template>
    <section id="contacto" class="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div
            class="grid overflow-hidden rounded-3xl bg-elevated shadow-xl lg:grid-cols-[1fr_1.4fr]"
        >
            <div data-dark class="flex flex-col justify-between gap-12 p-8 md:p-12">
                <div class="flex flex-col gap-5">
                    <h2 class="text-4xl text-highlighted md:text-6xl">{{ copy.contactTitle }}</h2>
                    <p class="text-lg">{{ copy.contactSub }}</p>
                </div>
                <dl class="flex flex-col gap-5 text-base">
                    <div>
                        <dt class="text-sm text-muted">Teléfono</dt>
                        <dd>
                            <a
                                :href="contact.phoneHref"
                                class="text-xl font-semibold text-highlighted"
                            >
                                {{ contact.phone }}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-muted">WhatsApp</dt>
                        <dd>
                            <a
                                :href="contact.whatsapp"
                                class="text-highlighted underline underline-offset-4"
                                >Escribir</a
                            >
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-muted">Consulta</dt>
                        <dd>{{ contact.address }}, {{ contact.city }}</dd>
                    </div>
                </dl>
            </div>
            <div class="p-8 md:p-12">
                <LabForm />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { contact, copy } from "../fixtures";
</script>
