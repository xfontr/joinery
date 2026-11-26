import { selectorRule } from "./selectorRule.ts";

const noImplementationDetails = selectorRule({
    description:
        "Disallow specs reading a component's instance, which changes without its behaviour changing.",
    bans: {
        instance: {
            selector: "MemberExpression[property.name='vm']:not([parent.property.name='$emit'])",
            message:
                "Assert on what the component renders, or capture a composable's return inside the harness's `setup`; use `nextTick()` from `vue` and `useRouter()` instead of `vm.$nextTick` and `vm.$router`.",
        },
    },
});

export default noImplementationDetails;
