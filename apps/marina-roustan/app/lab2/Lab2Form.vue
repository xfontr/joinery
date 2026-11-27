<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <form v-if="!sent" class="lf" @submit.prevent="sent = true">
        <div class="lf-row">
            <label class="lf-field">
                <span>Tu nombre</span>
                <input required autocomplete="name" />
            </label>
            <label class="lf-field">
                <span>Teléfono o email</span>
                <input required autocomplete="email" />
            </label>
        </div>
        <label class="lf-field">
            <span>Si quieres, cuéntame algo más <em>(opcional)</em></span>
            <textarea rows="4" />
        </label>
        <label class="lf-consent">
            <input type="checkbox" required />
            <span>Acepto que Marina use estos datos solo para contestarme.</span>
        </label>
        <button type="submit" class="lf-submit">Enviar mensaje</button>
    </form>
    <div v-else class="lf-sent" role="status">
        <p class="lf-sent-title">Mensaje enviado.</p>
        <p>Te contestaré lo antes posible. Si es urgente, llámame al {{ contact.phone }}.</p>
    </div>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import { contact } from "./content";

const sent = ref(false);
</script>

<style scoped>
.lf {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}
.lf-field > span {
    display: block;
    margin-bottom: 0.6rem;
    font-weight: var(--f-label-weight, 600);
}
.lf-field em {
    font-style: normal;
    font-weight: 400;
    color: var(--f-muted);
}
.lf-row {
    display: grid;
    gap: 1.75rem;
}
@media (min-width: 640px) {
    .lf-row {
        grid-template-columns: 1fr 1fr;
    }
}
.lf-field input,
.lf-field textarea {
    width: 100%;
    font: inherit;
    color: inherit;
    background: var(--f-field, transparent);
    border: 1px solid var(--f-line);
    border-radius: var(--f-radius, 6px);
    padding: 0.8rem 0.9rem;
}
.lf-field input:focus,
.lf-field textarea:focus {
    outline: 2px solid var(--f-accent);
    outline-offset: 1px;
    border-color: var(--f-accent);
}
.lf-consent {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
}
.lf-consent input {
    margin-top: 0.3rem;
    width: 1.1rem;
    height: 1.1rem;
    accent-color: var(--f-accent);
}
.lf-submit {
    align-self: flex-start;
    font: inherit;
    font-weight: 600;
    padding: 0.9rem 1.8rem;
    border: 0;
    border-radius: var(--f-button-radius, 999px);
    background: var(--f-accent);
    color: var(--f-accent-ink);
    cursor: pointer;
}
.lf-submit:hover {
    filter: brightness(1.08);
}
.lf-sent {
    padding: 2rem;
    border: 1px solid var(--f-line);
    border-radius: var(--f-radius, 6px);
}
.lf-sent-title {
    font-weight: 600;
    font-size: 1.25em;
    margin-bottom: 0.5rem;
}
</style>
