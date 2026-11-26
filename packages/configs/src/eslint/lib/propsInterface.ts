import joinery from "../rules/index.ts";

const propsInterface: object = {
    files: ["**/*.vue"],
    plugins: { joinery },
    rules: {
        "joinery/props-shape": "error",
    },
};

export default propsInterface;
