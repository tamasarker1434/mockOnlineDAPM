import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load pipelines from localStorage
const loadPipelinesFromStorage = () => {
    try {
        const savedPipelines = localStorage.getItem("pipelines");
        return savedPipelines ? JSON.parse(savedPipelines) : [];
    } catch (error) {
        console.error("Error loading pipelines from storage:", error);
        return [];
    }
};

// Save pipelines to localStorage
const savePipelinesToStorage = (pipelines) => {
    try {
        localStorage.setItem("pipelines", JSON.stringify(pipelines));
    } catch (error) {
        console.error("Error saving pipelines to storage:", error);
    }
};

const initialState = {
    pipelines: loadPipelinesFromStorage(),
};

const pipelineSlice = createSlice({
    name: "pipelines",
    initialState,
    reducers: {
        savePipeline: (state, action) => {
            const { id, name, nodes, edges, image } = action.payload;

            if (id !== undefined && state.pipelines[id]) {
                // Update existing pipeline
                state.pipelines[id] = { name, nodes, edges, image };
            } else {
                // Add a new pipeline only if it doesn’t exist
                state.pipelines.push({ name, nodes, edges, image });
            }

            savePipelinesToStorage(state.pipelines); // Persist data
        },
        deletePipeline: (state, action) => {
            state.pipelines.splice(action.payload, 1);
            savePipelinesToStorage(state.pipelines);
        },
    },
});

export const { savePipeline, deletePipeline } = pipelineSlice.actions;

const store = configureStore({
    reducer: {
        pipelines: pipelineSlice.reducer,
    },
});

export default store;
