import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import DecisionQuestions from "./DecisionQuestions.vue";

const ITEMS = [
    { id: "0009-comment-discipline", question: "How long?", answer: "One sentence." },
    { id: "0032-console-output-policy", question: "Console?", answer: "Fails the build." },
];

describe("DecisionQuestions", () => {
    it("links each question to the report that settled it", async () => {
        const wrapper = await mountSuspended(DecisionQuestions, { props: { items: ITEMS } });

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual(
            ["/decisions/0009-comment-discipline", "/decisions/0032-console-output-policy"].map(
                portalUrl,
            ),
        );
        expect(wrapper.findAll("a span").map((span) => span.text())).toEqual([
            "How long?",
            "One sentence.",
            "Console?",
            "Fails the build.",
        ]);
    });
});
