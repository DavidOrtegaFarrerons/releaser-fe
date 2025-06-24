import axios from "axios";
import {Response} from "../component/ReleaseTable/ReleaseTable.types.ts";

const API_URL = 'http://localhost:8080/api'

export type PrTask = {
    id: number;
    prId: number;
    type: 'PRE' | 'POST';
    content: string;
};

export async function addTask(prId: string, releaseId: string | undefined, type: string, content: string) : Promise<Response> {
    if (releaseId === undefined) {
        throw new Error("The release cannot be null, check URL");
    }

    try {
        let url = `${API_URL}/task`;

        const response = await axios.post(url, {
            prId: prId,
            releaseId: releaseId,
            type: type,
            content: content
        })

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Could not retrieve data')
        } else {
            throw new Error("An unexpected error ocurred")
        }
    }
}

export async function getTasksFromPrIdsAndType(prIds: number[], type: string) {
    if (prIds.length === 0) return [];

    let url = `${API_URL}/tasks`;

    try {
        const response = await axios.post(url, {
            prIds: prIds,
            type: type,
        })

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Could not retrieve data')
        } else {
            throw new Error("An unexpected error ocurred")
        }
    }
}