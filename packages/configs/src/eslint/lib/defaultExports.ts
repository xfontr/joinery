import joinery from "../rules/index.ts";

const rules = { "joinery/named-default-export": "error" };

const defaultExports: object = {
    files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: { joinery },
    rules,
};

const defaultExportsVue: object = {
    files: ["**/*.vue"],
    plugins: { joinery },
    rules,
};

export { defaultExports, defaultExportsVue };
