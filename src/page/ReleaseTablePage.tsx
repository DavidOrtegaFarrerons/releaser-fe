import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader, Text } from '@mantine/core';
import { ReleaseTable } from '../component/ReleaseTable.tsx';
import {getReleaseTableData} from "../services/releaseTable.ts";

function ReleaseTablePage() {
    const { releaseName } = useParams<{ releaseName: string }>();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await getReleaseTableData(releaseName);
                setData(response);
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

    return <ReleaseTable data={data} />;
}

export default ReleaseTablePage;