import type { ItemKey } from "../../../../../shared/types/ItemKey.ts";
import type { Proposal } from "../../../../../shared/types/Proposal.ts";
import { review } from "../../../../services/operations.ts";

export default defineEventHandler((event) =>
    refusing(async () =>
        review.edit(
            useStore(event),
            getRouterParam(event, "id")!,
            getRouterParam(event, "key") as ItemKey,
            await readBody<Partial<Proposal> | null>(event),
        ),
    ),
);
