import React, { useState } from 'react';
import { Table, Checkbox, Group, Avatar, Text, Button, Modal, Select, Textarea } from '@mantine/core';
import cx from 'clsx';
import { canBeAutocompleted } from './utils.ts';
import classes from './TableSelection.module.css';
import { setAutoCompletePR } from '../../services/releaseTable.ts';

import {addTask} from "../../services/task.ts";
import {useParams} from "react-router-dom";

export function TableRow({ item, index, selected, onToggleRow }) {
    const { releaseName } = useParams();
    const id = index.toString();
    const ticket = item.ticket;
    const pr = item.pullRequest;

    // Modal state
    const [opened, setOpened] = useState(false);
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<{ type?: string; content?: string }>({});

    // Validation helper
    const validate = () => {
        const newErrors: typeof errors = {};
        if (type !== 'PRE' && type !== 'POST') {
            newErrors.type = 'Type must be PRE merge or POST merge';
        }
        if (!content.trim()) {
            newErrors.content = 'Content cannot be empty';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await addTask(
                pr?.id,
                 releaseName,
                type,
                content,
            );
            alert('Task added successfully');
            setOpened(false);
            setType('');
            setContent('');
            setErrors({});
        } catch (error: any) {
            alert(`Failed to add instructions: ${error.message || error}`);
        }
    };

    return (
        <>
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
                    {pr?.url ? (
                        <a href={pr?.url} target="_blank" rel="noopener noreferrer">
                            {'PR link' || `PR #${pr?.id}`}
                        </a>
                    ) : (
                        'No PR'
                    )}
                </Table.Td>
                <Table.Td>{pr?.status || 'No PR found'}</Table.Td>
                <Table.Td>{pr?.reviewStatus || 'N/A'}</Table.Td>
                <Table.Td>{pr?.mergeStatus || 'N/A'}</Table.Td>
                <Table.Td>
                    <Button
                        size="xs"
                        disabled={!canBeAutocompleted(pr)}
                        onClick={
                            canBeAutocompleted(pr)
                                ? async () => {
                                    try {
                                        await setAutoCompletePR(pr?.id);
                                        alert(`Executing merge for PR #${pr?.id}`);
                                    } catch (error: any) {
                                        alert(`Failed to merge PR: ${error.message}`);
                                    }
                                }
                                : undefined
                        }
                    >Merge</Button>

                    { pr?.id ? (
                        <Button size="xs" ml={8} onClick={() => setOpened(true)}>
                            Add Instructions
                        </Button>
                        ) : (
                            <div></div>
                        )
                    }
                </Table.Td>
            </Table.Tr>

            {/* Modal with the form */}
            <Modal opened={opened} onClose={() => setOpened(false)} title="Add Instructions">
                <Select
                    label="Type"
                    placeholder="Select type"
                    data={[
                        { value: 'PRE', label: 'PRE merge' },
                        { value: 'POST', label: 'POST merge' },
                    ]}
                    value={type}
                    onChange={setType}
                    error={errors.type}
                    required
                />
                <Textarea
                    mt="md"
                    label="Content"
                    placeholder="Write instructions here"
                    value={content}
                    onChange={(event) => setContent(event.currentTarget.value)}
                    error={errors.content}
                    required
                    minRows={4}
                />
                <Group position="right" mt="md">
                    <Button onClick={handleSubmit}>Submit</Button>
                </Group>
            </Modal>
        </>
    );
}