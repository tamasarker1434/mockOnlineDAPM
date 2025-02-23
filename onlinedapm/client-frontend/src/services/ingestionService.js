import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const startIngestion = async (url) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/start-ingestion`, { url });
        return response.data.message;
    } catch (error) {
        console.error("API Error:", error);
        return "Failed to start ingestion.";
    }
};
