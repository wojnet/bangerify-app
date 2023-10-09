import { configureStore } from "@reduxjs/toolkit";
import globalSettingsReducer from "./settings/globalSettingsSlice";
import globalReducer from "./globalSlice";
import debugReducer from "./features/debugWindow/debugWindowSlice";
import postsReducer from "./features/posts/postsSlice";

const store = configureStore({
    reducer: {
        globalSettings: globalSettingsReducer,
        global: globalReducer,
        debug: debugReducer,
        posts: postsReducer
    }
});

export default store;