import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    lastLoadDate: new Date().getTime(),
    lastPostId: 99999999,
    postsEnded: false,
    canLoad: true,
    loading: false,
    error: "",
    posts: []
}

export const loadPosts = createAsyncThunk("posts/loadPosts", async (payload, { getState }) => {
    return axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { 
        lastPostId: getState().posts.lastPostId
    })
    .then(res => {
        return res.data;
    })
    .catch(error => {
        return error ? error : "";
    });
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts: () => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loadPosts.pending, (state) => {
                state.canLoad = false;
                state.loading = true;
                state.error = "";
            })
            .addCase(loadPosts.fulfilled, (state, action) => {
                if (action.payload.posts && !state.postsEnded) {
                    let lastPostId = [...action.payload.posts].slice(-1)[0].id;
                    return {
                        ...state,
                        lastLoadDate: new Date().getTime(),
                        lastPostId,
                        postsEnded: action.payload.postsEnded,
                        canLoad: true,
                        loading: false,
                        error: "",
                        posts: [...state.posts, ...action.payload.posts]
                    }
                } else {
                    return state;
                }
            })
            .addCase(loadPosts.rejected, (state, action) => {
                state.canLoad = true;
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;