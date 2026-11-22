/** The items either side of `index`, or neither when `index` is -1 because the item isn't listed. */
export const neighbours = <T>(items: readonly T[], index: number) => ({
    previous: index > 0 ? (items[index - 1] ?? null) : null,
    next: index === -1 ? null : (items[index + 1] ?? null),
});
