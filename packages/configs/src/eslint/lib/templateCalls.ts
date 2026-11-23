import joinery from "../rules/index.ts";

const templateCalls: object = {
    files: ["**/*.vue"],
    plugins: { joinery },
    rules: {
        "joinery/no-template-call": "error",
    },
};

export default templateCalls;
