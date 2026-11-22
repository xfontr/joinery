/** `useI18n()`'s `t`, handed to a util so the util stays pure and its spec runs without Nuxt. */
export type Translate = (key: string, named?: Record<string, unknown> | number) => string;
