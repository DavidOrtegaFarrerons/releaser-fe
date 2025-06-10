import axios from "axios";
import {Response} from "../component/ReleaseTable/ReleaseTable.types.ts";

const API_URL = 'http://localhost:8080/api'

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

export async function setAutoCompletePR(pullRequestId: string) : Promise<TableTicket[]> {
    try {
        const response = await axios.post(`${API_URL}/set-autocomplete`, {
            pullRequestId: pullRequestId,
        });

        return response.data; // This is already the parsed JSON
    } catch (error) {
        throw new Error(error.toString());
    }
}