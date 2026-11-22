export const defineAppConfig = <T>(config: T): T => config;

const configs = await Promise.all(
    Object.values(
        import.meta.glob<Record<string, unknown>>(
            ["../app/app.config.ts", "../layers/*/app/app.config.ts"],
            { import: "default" },
        ),
    ).map((load) => load()),
);

const appConfig = {
    ...Object.assign({}, ...configs),
    nav: Object.assign({}, ...configs.map(({ nav }) => nav)),
};

export const useAppConfig = () => appConfig;
