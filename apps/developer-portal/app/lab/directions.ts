export type Direction = "idea";

const FONTS = {
    idea: "family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400",
};

export const directions = [
    {
        id: "idea" as const,
        name: "Principles",
        idea: "The baseline. Told rule first: five principles carry the page, each with its proof, then the map every project runs on, then what the rules made. Warm paper, Fraunces, one terracotta.",
        faces: "Fraunces · Inter · IBM Plex Mono",
        refs: "W1 Bratiiev's statement, W2 Linear's serif and mono, W4 Rauno's plain lists",
        figure: "A real project plan as an unlabelled glyph",
        fonts: FONTS.idea,
    },
];

export const labPages = [
    { path: "", name: "Front page" },
    { path: "/method", name: "How it's made" },
    { path: "/workflows", name: "Workflows" },
    { path: "/craft", name: "The craft" },
    { path: "/work/huella-legal", name: "Huella Legal" },
    { path: "/e/developer", name: "Developer view" },
];

export const dropped =
    "Dropped stock traits: dashboard sidebar with icons, intent cards, coloured stat tiles, ringed rounded cards, tinted icons, pill badges, emoji project icons, green and slate defaults.";
