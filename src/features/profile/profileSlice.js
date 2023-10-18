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
    let posts = await axios.post(`${process.env.BACKEND_URL}/api/getUserPosts`, { 
        lastPostId: getState().profile.lastPostId,
        author: username
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
        },
        setAddedLikes: (state, action) => {
            let tempPosts = [
                ...state.posts
            ];

            const postIndex = tempPosts.findIndex(e => e.id === action.payload.id);
           
            tempPosts[postIndex].addedLikes = action.payload.number;

            state.posts = tempPosts;
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
                    let posts = action.payload.posts;
                    let lastPostId = posts[posts.length-1]?.id;

                    return {
                        ...state,
                        lastLoadDate: new Date().getTime(),
                        lastPostId,
                        postsEnded: action.payload.postsEnded,
                        canLoad: true,
                        loadingPosts: false,
                        postsError: "",
                        posts: [...state.posts, ...posts]
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

export const { resetProfilePosts, resetProfileInfo, setAddedLikes } = profileSlice.actions;
export default profileSlice.reducer;