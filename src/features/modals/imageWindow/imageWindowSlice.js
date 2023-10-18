import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    images: [],
    index: 0
}

const imageWindowSlice = createSlice({
    name: "imageWindow",
    initialState,
    reducers: {
        openImageWindow: (state) => {
            state.isOpen = true;
        },
        closeImageWindow: (state) => {
            state.isOpen = false;
        },
        changeImageWindowIndex: (state, action) => {
            state.index += action.payload;
        },
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setImageIndex: (state, action) => {
            state.index = action.payload;
        }
    }
});

export const { openImageWindow, closeImageWindow, changeImageWindowIndex, setImages, setImageIndex } = imageWindowSlice.actions;
export default imageWindowSlice.reducer;