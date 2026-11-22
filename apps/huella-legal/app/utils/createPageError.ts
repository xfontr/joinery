import type { NuxtError } from "#app";

export const createPageError = (error: NuxtError): NuxtError => {
    const status =
        (error.cause as { response?: { status?: number } } | undefined)?.response?.status ?? 502;

    return createError({
        status,
        statusText: error.statusText,
        message: error.message,
        data: error.data,
        stack: error.stack,
        cause: error,
        fatal: import.meta.client || status >= 500,
    });
};
