<template>
    <section id="contacto" class="bg-elevated">
        <div
            class="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.3fr]"
        >
            <div class="flex flex-col gap-8">
                <h2 class="text-5xl leading-none text-highlighted md:text-7xl">
                    {{ copy.contactTitle }}
                </h2>
                <p class="max-w-sm text-xl">{{ copy.contactSub }}</p>
                <dl class="grid grid-cols-2 gap-6 text-base">
                    <div>
                        <dt class="text-sm text-muted">Teléfono</dt>
                        <dd>
                            <a :href="contact.phoneHref" class="text-highlighted">{{
                                contact.phone
                            }}</a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-muted">WhatsApp</dt>
                        <dd><a :href="contact.whatsapp" class="text-highlighted">Escribir</a></dd>
                    </div>
                    <div class="col-span-2">
                        <dt class="text-sm text-muted">Consulta</dt>
                        <dd>{{ contact.address }}, {{ contact.city }}</dd>
                    </div>
                </dl>
            </div>
            <LabForm />
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { contact, copy } from "../fixtures";
</script>
