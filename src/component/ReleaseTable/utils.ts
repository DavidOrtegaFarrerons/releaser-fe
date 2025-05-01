import {PullRequest} from "./ReleaseTable.types.ts";

export function canBeAutocompleted(pr: PullRequest) {
    return pr.status === 'active' && pr.reviewStatus === 'Approved';
}

export function sortData<T>(
    data: T[],
    accessor: keyof T | string,
    direction: 'asc' | 'desc'
): T[] {
    const sorted = [...data].sort((a, b) => {
        const aValue = getNestedValue(a, accessor);
        const bValue = getNestedValue(b, accessor);

        if (aValue === bValue) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        return String(aValue).localeCompare(String(bValue));
    });

    return direction === 'asc' ? sorted : sorted.reverse();
}

function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
}