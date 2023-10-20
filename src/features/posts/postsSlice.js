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

// LOAD POSTS WITH LIKES
export const loadPosts = createAsyncThunk("posts/loadPosts", async (payload, { getState }) => {
    let posts = await axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { 
        lastPostId: getState().posts.lastPostId
    })
    .then(res => {
        return res.data;
    })
    .catch(error => {
        return error ? error : "";
    });

    const likes = await axios.post(`${process.env.BACKEND_URL}/api/loadLikesFromArray`, {
        token: localStorage.getItem("accessToken") || "",
        postIdArray: Object.values(posts.posts).map(e => e.id)
    })
    .then(res => res.data);

    posts.posts = Object.values(posts.posts).map(postData => {
        const likesData = likes.data.filter(likesData => likesData.postId === postData.id)[0];
        return {
            ...postData,
            likes: likesData.likes,
            isLiked: likesData.liked,
            addedLikes: 0
        }
    });

    return posts;
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts: () => {
            return initialState;
        },
        setAddedLikes: (state, action) => {
            let tempPosts = [
                ...state.posts
            ];

            const postIndex = tempPosts.findIndex(e => e.id === action.payload.id);
           
            if (tempPosts[postIndex].addedLikes === action.payload.number) return state;

            tempPosts[postIndex].addedLikes = action.payload.number;

            state.posts = tempPosts;
        },
        unlikePosts: (state) => {
            
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
                    let posts = action.payload.posts;
                    let lastPostId = posts[posts.length-1]?.id;

                    return {
                        ...state,
                        lastLoadDate: new Date().getTime(),
                        lastPostId,
                        postsEnded: action.payload.postsEnded,
                        canLoad: true,
                        loading: false,
                        error: "",
                        posts: [...state.posts, ...posts]
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

export const { resetPosts, setAddedLikes } = postsSlice.actions;
export default postsSlice.reducer;