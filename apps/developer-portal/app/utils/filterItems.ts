/** A filter select's options: one `"all"` entry first, then one per value. */
export const filterItems = <Value extends string>(
    everyLabel: string,
    values: readonly Value[],
    labelOf: (value: Value) => string = (value) => value,
): { label: string; value: Value | "all" }[] => [
    { label: everyLabel, value: "all" },
    ...values.map((value) => ({ label: labelOf(value), value })),
];
