<template>
    <section
        id="terapias"
        class="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_2fr]"
    >
        <div class="flex flex-col gap-5 lg:sticky lg:top-10 lg:self-start">
            <h2 class="text-4xl/tight text-highlighted md:text-6xl">¿Qué te <em>trae</em>?</h2>
            <p class="max-w-sm text-lg">
                Elige lo que más se parezca a lo que vives y empezamos por ahí.
            </p>
        </div>
        <div class="flex flex-col">
            <details
                v-for="item in reasons"
                :key="item.topic"
                class="group border-t border-default py-6 last-of-type:border-b"
            >
                <summary
                    class="grid cursor-pointer list-none grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2"
                >
                    <span class="text-2xl tracking-tight text-highlighted md:text-3xl">{{
                        item.title
                    }}</span>
                    <span
                        class="row-span-2 self-center text-2xl text-muted transition group-open:rotate-45"
                        aria-hidden="true"
                    >
                        +
                    </span>
                    <span class="text-lg text-muted">{{ item.body }}</span>
                </summary>
                <div class="mt-6 flex max-w-2xl flex-col items-start gap-5">
                    <p class="text-lg">{{ item.detail }}</p>
                    <UButton
                        :to="{ path: `${base}/contacto`, query: { motivo: item.topic } }"
                        color="neutral"
                        size="lg"
                        label="Escríbeme sobre esto"
                        class="rounded-full px-6"
                    />
                </div>
            </details>
            <div class="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
                <p class="text-lg">
                    Trabajo en sesiones individuales, de pareja y de grupo, en la consulta del
                    Eixample.
                </p>
                <div class="flex flex-col items-start gap-3 rounded-2xl bg-muted p-6">
                    <p class="text-lg text-highlighted">¿Te deriva un juzgado o un abogado?</p>
                    <p class="text-base">
                        También hago coordinación de parentalidad y psicología forense.
                    </p>
                    <NuxtLink
                        :to="{
                            path: `${base}/contacto`,
                            query: { motivo: 'Familia y parentalidad' },
                        }"
                        class="text-base text-highlighted underline underline-offset-4"
                    >
                        Contactar sobre un caso
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { concerns } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

// Lab copy that restates the live site's own service texts, one per concern topic.
const details: Record<string, string> = {
    "Ansiedad o estrés":
        "Vivimos rodeados de exigencias y mandatos que nos empujan a una sobreadaptación que el cuerpo acaba notando. En terapia individual buscamos de dónde viene esa carga y cómo soltarla.",
    Pareja: "Cuando la convivencia deja de ser un lugar tranquilo, ponemos palabras a lo que os pasa para que podáis decidir cómo seguir.",
    Cáncer: "Llevo más de 15 años realizando terapias individuales y en grupo para afrontar las consecuencias psicológicas del cáncer, para quien lo vive y para su familia.",
    Trauma: "El trastorno postraumático se desarrolla después de una experiencia traumática. Tratar los síntomas a tiempo evita que se cronifiquen.",
    "Familia y parentalidad":
        "Como coordinadora de parentalidad gestiono el conflicto, enseño recursos y cuido la parte emocional, para que los hijos dejen de quedar en medio.",
    "Cuerpo y emociones":
        "La psiconeuroinmunología estudia cómo se relacionan la mente y el sistema inmune: entendemos la salud como una armonía entre cuerpo y mente.",
};

const reasons = concerns.map((item) => ({ ...item, detail: details[item.topic] ?? item.body }));
</script>
