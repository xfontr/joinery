export interface ProjectNode {
    name: string;
    root: string;
    tags: string[];
    dependsOn: string[];
    dependedOnBy: string[];
}
