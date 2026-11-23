/** Prefixes a path with the developer portal, which is a separate site; a full URL passes through. */
export const portalUrl = (path: string): string =>
    path.startsWith("/") ? `${useAppConfig().portalUrl}${path}` : path;
