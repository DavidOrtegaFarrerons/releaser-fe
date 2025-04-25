import React, { useState, useEffect } from 'react';
import {Button, TextInput, Group, Center} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

const getNextRelease = (currentRelease: string) => {
    const [year, month, release] = currentRelease.split('-');
    let currentYear = parseInt(year);
    let currentMonth = parseInt(month);
    let currentReleaseNumber = release === 'r1' ? 'r2' : 'r1';

    if (release === 'r2') {
        currentMonth += 1;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear += 1;
        }
        currentReleaseNumber = 'r1';
    }

    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentReleaseNumber}`;
};

const getPreviousRelease = (currentRelease: string) => {
    const [year, month, release] = currentRelease.split('-');
    let currentYear = parseInt(year);
    let currentMonth = parseInt(month);
    let currentReleaseNumber = release === 'r1' ? 'r2' : 'r1';

    if (release === 'r1') {
        currentMonth -= 1;
        if (currentMonth <= 0) {
            currentMonth = 12;
            currentYear -= 1;
        }
        currentReleaseNumber = 'r2';
    }

    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentReleaseNumber}`;
};

const ReleaseNavigation = ({ currentRelease }: { currentRelease: string }) => {
    const navigate = useNavigate();

    const updateRelease = (newRelease: string) => {
        navigate(`/${newRelease}`);
    };

    const handleForward = () => {
        if (currentRelease) {
            const nextRelease = getNextRelease(currentRelease);
            updateRelease(nextRelease);
        }
    };

    const handleBack = () => {
        if (currentRelease) {
            const prevRelease = getPreviousRelease(currentRelease);
            updateRelease(prevRelease);
        }
    };

    return (
        <div>
            <Center mt={10} mb={5}>
                <h2>Current Release</h2>
            </Center>
            <Center mb={20}>

                <Button onClick={handleBack} variant="outline">
                    ←
                </Button>
                <TextInput
                    value={currentRelease || ''}
                    onChange={() => {}}
                    readOnly
                    style={{ textAlign: 'center' }}
                    size="md"
                    mx={10}
                />
                <Button onClick={handleForward} variant="outline">
                    →
                </Button>
            </Center>
        </div>
    );
};

export default ReleaseNavigation;