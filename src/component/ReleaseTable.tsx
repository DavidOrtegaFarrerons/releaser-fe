import { useState, useEffect } from 'react';
import cx from 'clsx';
import { Avatar, Checkbox, Group, ScrollArea, Table, Text, Loader } from '@mantine/core';
import classes from './TableSelection.module.css';
import { getReleaseTableData } from "../services/releaseTable.ts";

export function ReleaseTable() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selection, setSelection] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getReleaseTableData();
                console.log("Fetched data:", data);
                setTableData(data);
                setSelection([]);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const toggleRow = (id) => {
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const toggleAll = () => {
        setSelection((current) =>
            current.length === tableData.length ? [] : tableData.map((item, index) => index.toString())
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader size="xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h3>Error loading data:</h3>
                <p>{error}</p>
            </div>
        );
    }

    const rows = tableData.map((item, index) => {
        const id = index.toString();
        const selected = selection.includes(id);
        const ticket = item.ticket || {};
        const pr = item.pullRequest || {};

        return (
            <Table.Tr key={id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(id)} onChange={() => toggleRow(id)} />
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        {ticket.assignee?.profileImage && (
                            <Avatar size={26} src={ticket.assignee.profileImage} radius={26} />
                        )}
                        <Text size="sm" fw={500}>
                            {ticket.assignee?.displayName || 'Unassigned'}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <a href={`https://jira.company.com/browse/${ticket.key}`} target="_blank" rel="noopener noreferrer">
                        {ticket.key || 'N/A'}
                    </a>
                </Table.Td>
                <Table.Td>{ticket.status || 'N/A'}</Table.Td>
                <Table.Td>
                    {pr.url ? (
                        <a href={pr.url} target="_blank" rel="noopener noreferrer">
                            {pr.branchName || `PR #${pr.id}`}
                        </a>
                    ) : 'No PR'}
                </Table.Td>
                <Table.Td>{pr.mergeStatus || 'N/A'}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <ScrollArea>
            <Table miw={800} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === tableData.length && tableData.length > 0}
                                indeterminate={selection.length > 0 && selection.length !== tableData.length}
                            />
                        </Table.Th>
                        <Table.Th>Assignee</Table.Th>
                        <Table.Th>Ticket</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Pull Request</Table.Th>
                        <Table.Th>PR Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}