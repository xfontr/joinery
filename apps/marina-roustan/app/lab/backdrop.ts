export const backdropVariants = ["ninguno", "ondas", "relieve", "bruma", "hilo", "agua"] as const;

export type BackdropVariant = (typeof backdropVariants)[number];

const isVariant = (value: unknown): value is BackdropVariant =>
    backdropVariants.includes(value as BackdropVariant);

export const useBackdropVariant = () => {
    const route = useRoute();
    return computed<BackdropVariant>(() =>
        isVariant(route.query.fondo) ? route.query.fondo : "ondas",
    );
};
