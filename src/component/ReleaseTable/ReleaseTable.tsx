import {
    ScrollArea,
    Table,
    Checkbox,
    UnstyledButton,
    Center,
    Text,
    Group,
} from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import React, { useState, useEffect, useMemo } from 'react';

import { TableRow } from './TableRow';
import { TableTicket } from './ReleaseTable.types';
import { sortData, canBeAutocompleted } from './utils';

type ReleaseTableProps = {
    tableTickets: TableTicket[];
    onSelectionChange: (ids: string[]) => void; // NEW
};

export function ReleaseTable({ tableTickets, onSelectionChange }: ReleaseTableProps) {
    const [selection, setSelection] = useState<string[]>([]);
    const [sortedData, setSortedData] = useState<TableTicket[]>(tableTickets);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const mergeableIds = useMemo(
        () =>
            tableTickets
                .map((t, idx) => (canBeAutocompleted(t.pullRequest) ? idx.toString() : null))
                .filter(Boolean) as string[],
        [tableTickets]
    );

    useEffect(() => {
        setSelection([]);
        setSortedData(tableTickets);
        onSelectionChange([]); // keep parent in sync
    }, [tableTickets, onSelectionChange]);

    const toggleRow = (id: string) => {
        if (!mergeableIds.includes(id)) return;          // ignore non-mergeable rows
        setSelection((curr) => {
            const next = curr.includes(id) ? curr.filter((i) => i !== id) : [...curr, id];
            onSelectionChange(next);
            return next;
        });
    };

    const toggleAll = () => {
        setSelection((curr) => {
            const next = curr.length === mergeableIds.length ? [] : mergeableIds;
            onSelectionChange(next);
            return next;
        });
    };

    const setSorting = (field: string) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        const sorted = sortData(tableTickets, field, reversed ? 'desc' : 'asc');
        setSortedData(sorted);
    };

    const ThSortable = ({
                            children,
                            field,
                        }: {
        children: React.ReactNode;
        field: string;
    }) => {
        const Icon =
            sortBy === field
                ? reverseSortDirection
                    ? IconChevronUp
                    : IconChevronDown
                : IconSelector;

        return (
            <Table.Th>
                <UnstyledButton onClick={() => setSorting(field)} style={{ width: '100%' }}>
                    <Group justify="space-between">
                        <Text fw={500} fz="sm">
                            {children}
                        </Text>
                        <Center>
                            <Icon size={14} stroke={1.5} />
                        </Center>
                    </Group>
                </UnstyledButton>
            </Table.Th>
        );
    };

    return (
        <ScrollArea>
            <Table miw={800} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === mergeableIds.length && mergeableIds.length > 0}
                                indeterminate={selection.length > 0 && selection.length < mergeableIds.length}
                            />
                        </Table.Th>

                        <ThSortable field="ticket.assignee.displayName">Assignee</ThSortable>
                        <ThSortable field="ticket.key">Ticket</ThSortable>
                        <ThSortable field="ticket.status">Ticket Status</ThSortable>
                        <ThSortable field="pullRequest.branchName">Pull Request</ThSortable>
                        <ThSortable field="pullRequest.status">PR Status</ThSortable>
                        <ThSortable field="pullRequest.reviewStatus">Review Status</ThSortable>
                        <ThSortable field="pullRequest.mergeStatus">Merge Status</ThSortable>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {sortedData.map((item, index) => (
                        <TableRow
                            key={index}
                            item={item}
                            index={index}
                            selected={selection.includes(index.toString())}
                            onToggleRow={toggleRow}
                        />
                    ))}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}
