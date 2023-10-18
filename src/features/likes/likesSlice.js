import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

initialState = [

];

export const loadLikesFromArray = createAsyncThunk("likes/loadLikesFromArray", async (postIdArray) => {
    axios.post();
});

const likesSlice = createSlice({
    name: "likes",
    initialState,
    extraReducers(builder) {
        builder
            .addCase(loadLikesFromArray.pending, (state) => {

            })
            .addCase(loadLikesFromArray.fulfilled, (state, action) => {

            })
            .addCase(loadLikesFromArray.rejected, (state, action) => {

            })
    }
});

export default likesSlice.reducer;