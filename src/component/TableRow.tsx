import { Table, Checkbox, Group, Avatar, Text, Button } from '@mantine/core';
import cx from 'clsx';
import { canBeAutocompleted } from './utils';
import classes from './TableSelection.module.css';
import { setAutoCompletePR } from '../services/releaseTable';

export function TableRow({ item, index, selected, onToggleRow }) {
    const id = index.toString();
    const ticket = item.ticket || {};
    const pr = item.pullRequest || {};

    return (
        <Table.Tr key={id} className={cx({ [classes.rowSelected]: selected })}>
            <Table.Td>
                <Checkbox checked={selected} onChange={() => onToggleRow(id)} />
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
                <a href={ticket.url} target="_blank" rel="noopener noreferrer">
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
            <Table.Td>{pr.status || 'No PR found'}</Table.Td>
            <Table.Td>{pr.reviewStatus || 'N/A'}</Table.Td>
            <Table.Td>{pr.mergeStatus || 'N/A'}</Table.Td>
            <Table.Td>
                {canBeAutocompleted(pr) ? (
                    <Button
                        size="xs"
                        onClick={async () => {
                            try {
                                await setAutoCompletePR(pr.id);
                                alert(`Autocomplete set for PR #${pr.id}`);
                            } catch (error) {
                                alert(`Failed to set autocomplete: ${error.message}`);
                            }
                        }}
                    >
                        Auto Complete
                    </Button>
                ) : null}
            </Table.Td>
        </Table.Tr>
    );
}