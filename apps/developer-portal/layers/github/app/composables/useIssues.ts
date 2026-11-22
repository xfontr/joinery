import {
    issuesApiUrl,
    toIssues,
    type GithubIssue,
    type IssuesRead,
} from "#layers/github/app/utils/issues.ts";
import { messageOf } from "#layers/github/app/utils/github.ts";

const NO_ISSUES: IssuesRead = { fetchedAt: "", error: null, issues: [] };

const PER_PAGE = 100;

const read = async (repoUrl: string): Promise<IssuesRead> => {
    const fetchedAt = new Date().toISOString();
    const url = issuesApiUrl(repoUrl);

    if (url === null)
        return {
            fetchedAt,
            error: "NUXT_PUBLIC_REPO_URL is unset, so there is no repo to read.",
            issues: [],
        };

    try {
        const payload = await $fetch<GithubIssue[]>(url, {
            query: { state: "open", per_page: PER_PAGE },
        });

        return { fetchedAt, error: null, issues: toIssues(payload) };
    } catch (cause) {
        return { fetchedAt, error: messageOf(cause, "GitHub could not be read"), issues: [] };
    }
};

export const useIssues = () => {
    const {
        public: { repoUrl },
    } = useRuntimeConfig();

    const state = useAsyncData<IssuesRead>("issues", () => read(repoUrl), {
        default: () => NO_ISSUES,
        server: false, // A baked issue list would ship as old as the deploy.
    });

    const mounted = ref(false);
    onMounted(() => (mounted.value = true));
    // The server never reads GitHub, so every client render before hydration ends must match it
    const shown = computed(() => (mounted.value ? state.data.value : NO_ISSUES));

    return Object.assign(state, { reload: state.refresh, shown });
};
