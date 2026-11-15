/** The article as WordPress had it at pull time; `content` is `content.raw`. */
export interface Snapshot {
    title: string;
    excerpt: string;
    content: string;
    modifiedGmt: string;
}
