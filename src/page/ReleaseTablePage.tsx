import React, { useEffect, useState, useCallback } from 'react';
import { Loader, Text, Modal, Stepper, Group, Button, Table } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { ReleaseTable } from '../component/ReleaseTable/ReleaseTable';
import ReleaseNavigation from '../component/ReleaseNavigation/ReleaseNavigation';
import { getReleaseTableData } from '../services/releaseTable';
import { getTasksFromPrIdsAndType, PrTask } from '../services/task';
import { setAutoCompletePRs } from '../services/releaseTable.ts';

function ReleaseTablePage() {
    const { releaseName } = useParams<{ releaseName: string }>();

    const [currentRelease, setCurrentRelease] = useState('');
    const [tableTickets, setTableTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [selectedPrIds, setSelectedPrIds] = useState<string[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [preTasks, setPreTasks] = useState<PrTask[]>([]);
    const [preTasksLoading, setPreTasksLoading] = useState(false);
    const [preTasksError, setPreTasksError] = useState<string | null>(null);

    const [mergeLoading, setMergeLoading] = useState(false);
    const [mergeError, setMergeError] = useState<string | null>(null);

    const [postTasks, setPostTasks] = useState<PrTask[]>([]);
    const [postTasksLoading, setPostTasksLoading] = useState(false);
    const [postTasksError, setPostTasksError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getReleaseTableData(releaseName);
                setCurrentRelease(response.currentRelease);
                setTableTickets(response.tableTickets);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [releaseName]);

    const handleSelectionChange = useCallback(
        (rowIds: string[]) => {
            setSelectedRows(rowIds);
            const prIds = rowIds
                .map((rowId) => tableTickets[Number(rowId)]?.pullRequest?.id ?? null)
                .filter((id): id is number => id !== null);
            setSelectedPrIds(prIds);
        },
        [tableTickets],
    );

    const openModal = async () => {
        setPreTasks([]);
        setPreTasksError(null);
        setPreTasksLoading(true);
        try {
            const tasks = await getTasksFromPrIdsAndType(selectedPrIds, 'PRE');
            setPreTasks(tasks);
        } catch (err: any) {
            setPreTasksError(err.message);
        } finally {
            setPreTasksLoading(false);
            setModalOpen(true);
            setActiveStep(0);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveStep(0);
    };

    const nextStep = async () => {
        if (activeStep === 0) {
            setMergeLoading(true);
            setMergeError(null);
            try {
                await setAutoCompletePRs(selectedPrIds);
            } catch (err: any) {
                setMergeError(err.message);
                setMergeLoading(false);
                return;
            }
            setMergeLoading(false);
            setActiveStep(1);
            return;
        }

        if (activeStep === 1) {
            setPostTasks([]);
            setPostTasksError(null);
            setPostTasksLoading(true);
            try {
                const tasks = await getTasksFromPrIdsAndType(selectedPrIds, 'POST');
                setPostTasks(tasks);
            } catch (err: any) {
                setPostTasksError(err.message);
                setPostTasksLoading(false);
                return;
            }
            setPostTasksLoading(false);
            setActiveStep(2);
            return;
        }

        setActiveStep(3);
    };

    const prevStep = () => setActiveStep((s) => Math.max(s - 1, 0));

    const renderTaskTable = (loading: boolean, err: string | null, tasks: PrTask[]) => {
        if (loading) return <Loader mt="sm" />;
        if (err) return <Text c="red">Error: {err}</Text>;
        if (tasks.length === 0) return <Text>No tasks for these PRs.</Text>;
        return (
            <Table withBorder mt="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>PR ID</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Content</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {tasks.map((t) => (
                        <Table.Tr key={t.id}>
                            <Table.Td>{t.prId}</Table.Td>
                            <Table.Td>{t.type}</Table.Td>
                            <Table.Td>{t.content}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        );
    };

    if (loading) return <Loader />;
    if (error) return <Text c="red">Error: {error}</Text>;

    return (
        <>
            <ReleaseNavigation
                currentRelease={currentRelease}
                canStart={selectedPrIds.length > 0}
                onStart={openModal}
            />

            <ReleaseTable
                tableTickets={tableTickets}
                onSelectionChange={handleSelectionChange}
            />

            <Modal opened={modalOpen} onClose={closeModal} title="Release Process" size="lg">
                <Stepper active={activeStep} orientation="vertical" my="md">
                    <Stepper.Step label="Tasks" description="PRE-merge tasks">
                        <Text fw={500}>These are the PRE-merge tasks:</Text>
                        {renderTaskTable(preTasksLoading, preTasksError, preTasks)}
                    </Stepper.Step>

                    <Stepper.Step label="Merging" description="Autocompleting pull requests">
                        {mergeLoading && <Loader />}
                        {mergeError && <Text c="red">Error: {mergeError}</Text>}
                        {!mergeLoading && !mergeError && <Text>Pull-requests merged successfully.</Text>}
                    </Stepper.Step>

                    <Stepper.Step label="Tagging" description="POST-merge tasks">
                        {renderTaskTable(postTasksLoading, postTasksError, postTasks)}
                    </Stepper.Step>

                    <Stepper.Completed>Release finished!</Stepper.Completed>
                </Stepper>

                <Group justify="flex-end" mt="md">
                    {activeStep > 0 && activeStep < 3 && (
                        <Button variant="default" onClick={prevStep}>
                            Back
                        </Button>
                    )}

                    {activeStep < 3 && (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (activeStep === 0 && preTasksLoading) ||
                                (activeStep === 1 && mergeLoading) ||
                                (activeStep === 2 && postTasksLoading)
                            }
                        >
                            {activeStep === 2 ? 'Finish' : 'Next'}
                        </Button>
                    )}

                    {activeStep === 3 && <Button onClick={closeModal}>Close</Button>}
                </Group>
            </Modal>
        </>
    );
}

export default ReleaseTablePage;