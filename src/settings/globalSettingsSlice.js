import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDebugWindowOpen: false,
    loadPostsBottomMargin: 50
}

const globalSettingsSlice = createSlice({
    name: "globalSettings",
    initialState,
    reducers: {
        toggleDebugWindow: (state) => {
            state.isDebugWindowOpen = !state.isDebugWindowOpen;
        }
    }
});

export const { toggleDebugWindow } = globalSettingsSlice.actions;
export default globalSettingsSlice.reducer;