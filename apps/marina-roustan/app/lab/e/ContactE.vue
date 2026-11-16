<template>
    <section id="contacto" class="bg-elevated">
        <div class="mx-auto flex max-w-3xl flex-col gap-14 px-5 py-24 md:py-32">
            <div class="flex flex-col items-center gap-5 text-center">
                <h2 class="text-5xl text-highlighted md:text-7xl">{{ copy.contactTitle }}</h2>
                <p class="max-w-md text-xl">{{ copy.contactSub }}</p>
            </div>
            <LabForm />
            <dl class="grid gap-6 border-t border-default pt-10 text-center sm:grid-cols-3">
                <div>
                    <dt class="text-sm text-muted">Teléfono</dt>
                    <dd>
                        <a :href="contact.phoneHref" class="text-lg text-highlighted">{{
                            contact.phone
                        }}</a>
                    </dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">WhatsApp</dt>
                    <dd>
                        <a :href="contact.whatsapp" class="text-lg text-highlighted">Escribir</a>
                    </dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Consulta</dt>
                    <dd class="text-lg">{{ contact.address }}</dd>
                </div>
            </dl>
        </div>
    </section>
</template>

<script setup lang="ts">
import LabForm from "../LabForm.vue";
import { contact, copy } from "../fixtures";
</script>
