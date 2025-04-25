import { ScrollArea, Table, Loader, Checkbox } from '@mantine/core';
import { TableRow } from './TableRow.tsx';
import { useState, useEffect } from 'react';
import {TableTicket} from "./ReleaseTable.types.ts";

type ReleaseTableProps = {
    tableTickets: TableTicket[];
};

export function ReleaseTable({ tableTickets }: ReleaseTableProps) {
    const [selection, setSelection] = useState<string[]>([]);

    console.log(tableTickets)
    useEffect(() => {
        setSelection([]);
    }, [tableTickets]);

    const toggleRow = (id: string) => {
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const toggleAll = () => {
        setSelection((current) =>
            current.length === tableTickets.length ? [] : tableTickets.map((_, index) => index.toString())
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
                                checked={selection.length === tableTickets.length && tableTickets.length > 0}
                                indeterminate={selection.length > 0 && selection.length !== tableTickets.length}
                            />
                        </Table.Th>
                        <Table.Th>Assignee</Table.Th>
                        <Table.Th>Ticket</Table.Th>
                        <Table.Th>Ticket Status</Table.Th>
                        <Table.Th>Pull Request</Table.Th>
                        <Table.Th>PR Status</Table.Th>
                        <Table.Th>Review Status</Table.Th>
                        <Table.Th>Merge Status</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {tableTickets.map((item, index) => (
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