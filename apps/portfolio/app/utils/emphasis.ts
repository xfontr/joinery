/** Splits copy on `**` markers, so a few hand-picked words can be set in bold. */
export const emphasis = (text: string): { text: string; strong: boolean }[] =>
    text
        .split("**")
        .map((part, index) => ({ text: part, strong: index % 2 === 1 }))
        .filter((part) => part.text);
