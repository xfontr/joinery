import type { PostType } from "./types/PostType.ts";

export const parseKey = (key: string): { type: PostType; id: number } | null => {
    const match = /^(posts|pages)-(\d+)$/.exec(key);

    return match ? { type: match[1] as PostType, id: Number(match[2]) } : null;
};
