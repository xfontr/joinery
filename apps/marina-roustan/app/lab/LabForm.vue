<template>
    <form class="flex flex-col gap-8" @submit.prevent>
        <fieldset class="flex flex-col gap-3">
            <legend class="mb-3 text-base font-medium text-highlighted">¿Qué te trae?</legend>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="topic in chips"
                    :key="topic"
                    type="button"
                    :aria-pressed="state.topics.includes(topic)"
                    class="rounded-full border px-4 py-2 text-base transition"
                    :class="
                        state.topics.includes(topic)
                            ? 'border-inverted bg-inverted text-inverted'
                            : 'border-default hover:border-accented'
                    "
                    @click="toggle(topic)"
                >
                    {{ topic }}
                </button>
            </div>
        </fieldset>

        <div class="grid gap-6 md:grid-cols-2">
            <UFormField label="Tu nombre" name="name" required>
                <UInput
                    v-model="state.name"
                    autocomplete="name"
                    size="xl"
                    variant="outline"
                    class="w-full"
                />
            </UFormField>
            <UFormField label="Teléfono o email" name="reach" required>
                <UInput
                    v-model="state.reach"
                    autocomplete="email"
                    size="xl"
                    variant="outline"
                    class="w-full"
                />
            </UFormField>
        </div>

        <UFormField label="Si quieres, cuéntame algo más" name="message" hint="Opcional">
            <UTextarea
                v-model="state.message"
                :rows="3"
                autoresize
                size="xl"
                variant="outline"
                class="w-full"
            />
        </UFormField>

        <div class="flex flex-col gap-5">
            <UCheckbox
                v-model="state.consent"
                required
                label="Acepto que la Dra. Roustan use estos datos solo para responderme."
            />
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                <UButton
                    type="submit"
                    color="neutral"
                    size="xl"
                    label="Enviar mensaje"
                    class="rounded-full px-8"
                />
                <span class="text-base text-muted">
                    o llama al
                    <a
                        :href="contact.phoneHref"
                        class="text-highlighted underline underline-offset-4"
                    >
                        {{ contact.phone }}
                    </a>
                </span>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { contact, copy } from "./fixtures";

interface Props {
    topics?: string[];
}

const props = defineProps<Props>();

const chips = computed(() => props.topics ?? copy.topics);
const { motivo } = useRoute().query;
const preselected = typeof motivo === "string" && chips.value.includes(motivo) ? [motivo] : [];

const state = reactive({
    topics: preselected,
    name: "",
    reach: "",
    message: "",
    consent: false,
});

const toggle = (topic: string) => {
    state.topics = state.topics.includes(topic)
        ? state.topics.filter((item) => item !== topic)
        : [...state.topics, topic];
};
</script>
