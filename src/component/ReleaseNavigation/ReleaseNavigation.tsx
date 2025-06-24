import React from 'react';
import { Button, TextInput, Center, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const getNextRelease = (current: string) => {
    const [y, m, r] = current.split('-');
    let year = Number(y);
    let month = Number(m);
    let rel = r === 'r1' ? 'r2' : 'r1';
    if (r === 'r2') {
        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
        rel = 'r1';
    }
    return `${year}-${month.toString().padStart(2, '0')}-${rel}`;
};

const getPreviousRelease = (current: string) => {
    const [y, m, r] = current.split('-');
    let year = Number(y);
    let month = Number(m);
    let rel = r === 'r1' ? 'r2' : 'r1';
    if (r === 'r1') {
        month -= 1;
        if (month <= 0) {
            month = 12;
            year -= 1;
        }
        rel = 'r2';
    }
    return `${year}-${month.toString().padStart(2, '0')}-${rel}`;
};

type Props = {
    currentRelease: string;
    canStart: boolean;
    onStart: () => void;
};

const ReleaseNavigation = ({ currentRelease, canStart, onStart }: Props) => {
    const navigate = useNavigate();

    const updateRelease = (newRelease: string) => {
        navigate(`/${newRelease}`);
    };

    return (
        <div>
            <Center mt={10} mb={5}>
                <h2>Current Release</h2>
            </Center>

            <Center mb={20}>
                <Group align="center">
                    <Button variant="outline" onClick={() => updateRelease(getPreviousRelease(currentRelease))}>
                        ←
                    </Button>

                    <TextInput
                        value={currentRelease}
                        readOnly
                        style={{ textAlign: 'center' }}
                        size="md"
                        mx={10}
                    />

                    <Button variant="outline" onClick={() => updateRelease(getNextRelease(currentRelease))}>
                        →
                    </Button>

                    <Button ml="md" onClick={onStart} disabled={false}>
                        Start Release
                    </Button>
                </Group>
            </Center>
        </div>
    );
};

export default ReleaseNavigation;
