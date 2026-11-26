import joinery from "../rules/index.ts";

const linterOptions = { reportUnusedDisableDirectives: "error" };

const rules = { "joinery/disable-needs-reason": "error" };

const disableReasons: object = {
    files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: { joinery },
    linterOptions,
    rules,
};

const disableReasonsVue: object = {
    files: ["**/*.vue"],
    plugins: { joinery },
    linterOptions,
    rules,
};

export { disableReasons, disableReasonsVue };
