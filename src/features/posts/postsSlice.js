import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lastLoadDate: new Date().getTime(),
    posts: [
        {
            id: 245,
            images: [],
            postUsername: "kn1ght",
            postVisibleName: "jan",
            profilePictureUrl: "https://bangerify-media.s3.eu-central-1.amazonaws.com/9c861da594106d2a258dd8d0d12b4568",
            text: "wiem, że nie wiesz o co chodzi, ale się dowiesz",
            utcDate: "2023-04-11T22:15:27.000Z",
            likes: 1,
            canLoadMoreComments: false
        }
    ]
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {

    }
});

export default postsSlice.reducer;