import joinery from "../rules/index.ts";

const routeMeta: object = {
    files: ["**/server/api/**/*.ts", "**/server/routes/**/*.ts"],
    ignores: ["**/*.spec.ts"],
    plugins: { joinery },
    rules: {
        "joinery/require-route-meta": "error",
    },
};

export default routeMeta;
