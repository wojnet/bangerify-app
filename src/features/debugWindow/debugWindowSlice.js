import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    lines: []
};

const debugWindowSlice = createSlice({
    name: "debug",
    initialState,
    reducers: {
        addDebugLine: (state, action) => {
            let { lines } = state;
            lines.push({
                id: uuidv4(),
                name: action.payload.name
            });
            state = { ...state, lines };
        },
    }
});

export const { addDebugLine } = debugWindowSlice.actions;
export default debugWindowSlice.reducer;