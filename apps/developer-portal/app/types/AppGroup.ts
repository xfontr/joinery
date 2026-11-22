export interface AppGroup {
    id: string;
    label: string;
    icon: string;
    /** Keys into the layers' `nav`; a key no layer declares is skipped, so removing a layer drops its entry. */
    items: string[];
    /** Its pages also show as tabs under the page title. */
    tabs?: boolean;
}
