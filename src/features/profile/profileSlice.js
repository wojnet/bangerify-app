import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    // USER
    loadingUserInfo: false,
    userError: "",
    userId: 0,
    visibleName: "",
    bio: "",
    grade: 0,
    creationDate: "",
    profilePictureUrl: "",

    // POSTS
    lastLoadDate: new Date().getTime(),
    lastPostId: 99999999,
    postsEnded: false,
    canLoad: true,
    loadingPosts: false,
    postsError: "",
    posts: []
}

export const loadProfilePosts = createAsyncThunk("profile/loadProfilePosts", async (username, { getState }) => {
    return axios.post(`${process.env.BACKEND_URL}/api/getUserPosts`, { 
        lastPostId: getState().profile.lastPostId,
        author: username
    })
    .then(res => {
        return res.data;
    })
    .catch(error => {
        console.log(1);
        return error ? error : "";
    });
});

export const loadProfileInfo = createAsyncThunk("profile/loadProfileInfo", async (username) => {
    return axios.post(`${process.env.BACKEND_URL}/api/userData/${username}`)
    .then(res => {
        return res.data[0];
    })
    .catch(err => {
        return err;
    });
});

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetProfilePosts: (state) => {
            return {
                ...state,
                lastLoadDate: new Date().getTime(),
                lastPostId: 99999999,
                postsEnded: false,
                canLoad: true,
                loadingPosts: false,
                postsError: "",
                posts: []
            }
        },
        resetProfileInfo: (state) => {
            return {
                ...state,
                loadingUserInfo: false,
                userError: "",
                userId: 0,
                visibleName: "",
                bio: "",
                grade: 0,
                creationDate: "",
                profilePictureUrl: ""
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loadProfilePosts.pending, (state) => {
                state.canLoad = false;
                state.loadingPosts = true;
                state.postsError = "";
            })
            .addCase(loadProfilePosts.fulfilled, (state, action) => {
                if (action.payload.posts && !state.postsEnded) {
                    let lastPostId = [...action.payload.posts].slice(-1)[0]?.id;
                    return {
                        ...state,
                        lastLoadDate: new Date().getTime(),
                        lastPostId,
                        postsEnded: action.payload.postsEnded,
                        canLoad: true,
                        loadingPosts: false,
                        postsError: "",
                        posts: [...state.posts, ...action.payload.posts]
                    }
                } else {
                    return state;
                }
            })
            .addCase(loadProfilePosts.rejected, (state, action) => {
                return {
                    ...state,
                    canLoad: true,
                    loadingPosts: false,
                    postsError: action.payload
                }
            })

            .addCase(loadProfileInfo.pending, (state) => {
                state.loadingUserInfo = true;
                state.userError = "";
                state.visibleName = "";
                state.bio = "";
                state.grade = 0;
                state.creationDate = "";
                state.profilePictureUrl = "";
                
            })
            .addCase(loadProfileInfo.fulfilled, (state, action) => {
                state.loadingUserInfo = false;
                state.userError = "";
                state.visibleName = action.payload.visible_name;
                state.bio = action.payload.bio;
                state.grade = action.payload.grade;
                state.creationDate = new Date(action.payload.creationDate).toLocaleDateString();
                state.profilePictureUrl = action.payload.profilePictureUrl;
            })
            .addCase(loadProfileInfo.rejected, (state, action) => {
                return {
                    ...state,
                    loadingUserInfo: false,
                    userError: action.payload,
                    visibleName: "",
                    bio: "",
                    grade: 0,
                    creationDate: "",
                    profilePictureUrl: ""
                }
            })
    }
});

export const { resetProfilePosts, resetProfileInfo } = profileSlice.actions;
export default profileSlice.reducer;