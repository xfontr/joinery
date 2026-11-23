import type { Asset } from "@joinery/content";

export interface Author {
    id: string;
    slug: string;
    name: string;
    bio?: string;
    avatar?: Asset;
}
