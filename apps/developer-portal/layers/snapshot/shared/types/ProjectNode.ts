export interface ProjectNode {
    name: string;
    root: string;
    /** Missing from a snapshot collected before the field existed. */
    type?: "app" | "lib" | "e2e";
    tags: string[];
    dependsOn: string[];
    dependedOnBy: string[];
}
