/** Prefixes a path with the developer portal, which is a separate app under this site's origin; a full URL passes through. */
export const portalUrl = (path: string): string =>
    path.startsWith("/") ? `${useAppConfig().portalUrl}${path}` : path;
