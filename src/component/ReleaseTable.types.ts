interface TableTicket {
    pullRequest: PullRequest|null,
    ticket: Ticket,
}

interface PullRequest {
    id: number;
    mergeStatus: string;
    createdBy: string;
    branchName: string;
    url: string;
    creationDate: string;
    status: string;
    reviewStatus: string;
}

interface Ticket {
    id: number;
    key: string;
    assignee: string;
    url: string;
    status: string;
}