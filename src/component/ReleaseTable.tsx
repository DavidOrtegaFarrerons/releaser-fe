import { ScrollArea, Table, Loader, Checkbox } from '@mantine/core';
import { TableRow } from './TableRow';
import { useState, useEffect } from 'react';

type ReleaseTableProps = {
    data: any[];
};

export function ReleaseTable({ data }: ReleaseTableProps) {
    const [selection, setSelection] = useState<string[]>([]);

    useEffect(() => {
        setSelection([]);
    }, [data]);

    const toggleRow = (id: string) => {
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const toggleAll = () => {
        setSelection((current) =>
            current.length === data.length ? [] : data.map((_, index) => index.toString())
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
                                checked={selection.length === data.length && data.length > 0}
                                indeterminate={selection.length > 0 && selection.length !== data.length}
                            />
                        </Table.Th>
                        <Table.Th>Assignee</Table.Th>
                        <Table.Th>Ticket</Table.Th>
                        <Table.Th>Ticket Status</Table.Th>
                        <Table.Th>Pull Request</Table.Th>
                        <Table.Th>PR Status</Table.Th>
                        <Table.Th>Review Status</Table.Th>
                        <Table.Th>Merge Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((item, index) => (
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