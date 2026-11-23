import joinery from "../rules/index.ts";

const templateI18n: object = {
    files: ["**/*.vue"],
    plugins: { joinery },
    rules: {
        "joinery/template-global-i18n": "error",
    },
};

export default templateI18n;
