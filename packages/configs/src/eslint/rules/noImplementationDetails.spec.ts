import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import noImplementationDetails from "./noImplementationDetails.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({ languageOptions: { parser: tseslint.parser } });

ruleTester.run("no-implementation-details", noImplementationDetails, {
    valid: [
        'expect(wrapper.find("button").attributes("aria-pressed")).toBe("true");',
        'wrapper.findComponent(Child).vm.$emit("close");',
        'expect(wrapper.findComponent({ name: "UButton" }).props("loading")).toBe(true);',
    ],
    invalid: [
        { code: "expect(wrapper.vm.reports).toEqual([]);", errors: [{ messageId: "instance" }] },
        { code: "await wrapper.vm.$nextTick();", errors: [{ messageId: "instance" }] },
        { code: "wrapper.vm.$router.push('/');", errors: [{ messageId: "instance" }] },
    ],
});
