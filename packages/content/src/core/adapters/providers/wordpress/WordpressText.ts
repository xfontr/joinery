// ISO-8859-1's names, in code-point order from U+00A0.
const LATIN_1 = (
    "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn " +
    "sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave " +
    "Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml " +
    "ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN " +
    "szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute " +
    "icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml " +
    "yacute thorn yuml"
).split(" ");

const NAMED = new Map<string, string>([
    ["amp", "&"],
    ["lt", "<"],
    ["gt", ">"],
    ["quot", '"'],
    ["apos", "'"],
    ["ndash", "–"],
    ["mdash", "—"],
    ["lsquo", "‘"],
    ["rsquo", "’"],
    ["ldquo", "“"],
    ["rdquo", "”"],
    ["hellip", "…"],
    ["bull", "•"],
    ["euro", "€"],
    ["trade", "™"],
    ...LATIN_1.map((name, index): [string, string] => [name, String.fromCodePoint(0xa0 + index)]),
]);

const ENTITY = /&(?:#(\d{1,7})|#x([\da-f]{1,6})|([a-z\d]{2,8}));/gi;

const fromCodePoint = (codePoint: number, entity: string): string =>
    codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;

const decodeEntities = (text: string): string =>
    text.replace(ENTITY, (entity, decimal?: string, hex?: string, name?: string) => {
        if (decimal) return fromCodePoint(Number.parseInt(decimal, 10), entity);
        if (hex) return fromCodePoint(Number.parseInt(hex, 16), entity);
        return NAMED.get(name ?? "") ?? entity;
    });

const TAG = /<[^<>]*>/g;

/** Display text from WordPress's entity-escaped titles, names and bios; not a sanitiser. */
export const toPlainText = (html: string): string =>
    decodeEntities(html.replaceAll(TAG, "")).replaceAll(/\s+/g, " ").trim();

// A tag becomes a space here, since two paragraphs end and start a word.
export const countWords = (html: string): number =>
    decodeEntities(html.replaceAll(TAG, " ")).split(/\s+/).filter(Boolean).length;
