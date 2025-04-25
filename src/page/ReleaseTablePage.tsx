import { useParams } from 'react-router-dom';
import {use, useEffect, useState} from 'react';
import { Loader, Text } from '@mantine/core';
import { ReleaseTable } from '../component/ReleaseTable/ReleaseTable.tsx';
import {getReleaseTableData} from "../services/releaseTable.ts";
import ReleaseNavigation from "../component/ReleaseNavigation/ReleaseNavigation.tsx";

function ReleaseTablePage() {
    const { releaseName } = useParams<{ releaseName: string }>();
    const [ currentRelease, setCurrentRelease ] = useState('')
    const [tableTickets, setTableTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
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
        }

        fetchData();
    }, [releaseName]);

    if (loading) return <Loader />;
    if (error) return <Text c="red">Error: {error}</Text>;

    return (
        <div>
            <ReleaseNavigation currentRelease={currentRelease} />
            <ReleaseTable tableTickets={tableTickets} />
        </div>
    );
}

export default ReleaseTablePage;