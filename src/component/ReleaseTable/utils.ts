import {PullRequest} from "./ReleaseTable.types.ts";

export function canBeAutocompleted(pr: PullRequest) {
    return pr.status === 'active' && pr.reviewStatus === 'Approved';
}