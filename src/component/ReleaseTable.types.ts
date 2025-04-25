export interface TableTicket {
    pullRequest: PullRequest|null,
    ticket: Ticket,
}

export interface PullRequest {
    id: number;
    mergeStatus: string;
    createdBy: string;
    branchName: string;
    url: string;
    creationDate: string;
    status: string;
    reviewStatus: string;
}

export interface Ticket {
    id: number;
    key: string;
    assignee: Assignee;
    url: string;
    status: string;
}

interface Assignee {
    profileImage: string;
    displayName: string;
}