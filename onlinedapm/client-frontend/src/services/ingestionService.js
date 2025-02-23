import axios from "axios";

const API_BASE_URL = "http://localhost:8080";  // Ensure correct backend URL

export const startIngestion = async (url) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/ingestion/start-ingestion`,
            { url },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;  // Return backend response
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return { error: "Failed to start ingestion." };
    }
};
