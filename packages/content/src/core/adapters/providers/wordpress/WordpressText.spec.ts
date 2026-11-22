import { describe, expect, it } from "vitest";
import { countWords, toPlainText } from "./WordpressText";

describe("toPlainText", () => {
    it("decodes what wptexturize and an author both write, so a title never shows &amp;", () => {
        expect(toPlainText("Ley &#8220;Org&aacute;nica&#8221; &amp; c")).toBe("Ley “Orgánica” & c");
    });

    it("decodes hex references and the typographic names", () => {
        expect(toPlainText("A&#x2019;s &hellip; &mdash;")).toBe("A’s … —");
    });

    it("strips tags before decoding, so escaped markup stays text", () => {
        expect(toPlainText("<em>Uno</em> &lt;b&gt;")).toBe("Uno <b>");
    });

    it("decodes a bad reference the way a browser would render it", () => {
        expect(toPlainText("&bogus; &#1114112;")).toBe("&bogus; \uFFFD");
    });

    it("collapses whitespace a paragraph break leaves behind", () => {
        expect(toPlainText("<p>Una</p>\n<p>bio</p>")).toBe("Una bio");
    });
});

describe("countWords", () => {
    it("splits words across a closing and an opening tag rather than gluing them", () => {
        expect(countWords("<p>una</p><p>dos</p>")).toBe(2);
    });

    it("counts no markup, not even an attribute's words", () => {
        const html =
            '<meta charset="utf-8"><span class="superfontello3-quote"></span>' +
            '<img src="https://wp.test/a.jpg" alt="una foto larga"><p>dos palabras</p>';

        expect(countWords(html)).toBe(2);
    });

    it("splits on a non-breaking space WordPress writes as an entity", () => {
        expect(countWords("art.&nbsp;14 CE")).toBe(3);
    });
});
