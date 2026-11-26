import { createError } from "h3";
import { vi } from "vitest";

/** h3's own `createError`, for a spec that hands a mocked dependency the error Nitro would throw. */
export { createError as httpError } from "h3";

/**
 * Stubs the Nitro auto-imports a server spec can't import: `defineEventHandler` hands back the
 * handler and `createError` is h3's own. Call it before the dynamic `import()` of the file under test.
 */
export const stubNitro = (): void => {
    vi.stubGlobal("defineEventHandler", (handler: unknown) => handler);
    vi.stubGlobal("createError", createError);
};
