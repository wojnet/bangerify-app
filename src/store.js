import { configureStore } from "@reduxjs/toolkit";
import globalSettingsReducer from "./settings/globalSettingsSlice";
import globalReducer from "./globalSlice";
import debugReducer from "./features/debugWindow/debugWindowSlice";
import postsReducer from "./features/posts/postsSlice";
import profileReducer from "./features/profile/profileSlice";
import imageWindowReducer from "./features/modals/imageWindow/imageWindowSlice";

const store = configureStore({
    reducer: {
        globalSettings: globalSettingsReducer,
        global: globalReducer,
        debug: debugReducer,
        posts: postsReducer,
        profile: profileReducer,
        imageWindow: imageWindowReducer
    }
});

export default store;