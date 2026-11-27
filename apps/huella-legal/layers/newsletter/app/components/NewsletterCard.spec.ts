import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import NewsletterCard from "./NewsletterCard.vue";

const MESSAGES = {
    newsletterCard: {
        kicker: "kicker",
        lead: "lead",
        subjectLead: "lead: {subject}",
    },
    newsletterForm: {
        email: { label: "email", placeholder: "placeholder" },
        notice: "notice {privacy}",
        privacy: "privacy",
        submit: "submit",
    },
};

describe("newsletter card", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    });

    it("names the subject in its lead when it sits on a subject page", async () => {
        const wrapper = await mountSuspended(NewsletterCard, {
            props: { subject: "derecho penal" },
        });

        expect(wrapper.find("p").text()).toBe("lead: derecho penal");
    });
});
