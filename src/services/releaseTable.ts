import axios from "axios";

const API_URL = 'http://localhost:8080'

export async function getReleaseTableData() {
    try {
        const response = await axios.get(`${API_URL}/release`)

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Could not retrieve data')
        } else {
            throw new Error("An unexpected error ocurred")
        }
    }
}