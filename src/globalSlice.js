import { createSlice } from "@reduxjs/toolkit";
import { applyTheme } from "./helpers/Theme";

const initialState = {
    isLogged: false,
    username: "",
    theme: "light",
    isMobile: false,
    navbarThreshold: 800,
    path: "/",
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setIsLogged: (state, action) => {
            state.isLogged = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload;
        },
        setPath: (state, action) => {
            state.path = action.payload;
        },
        setTheme: (state, action) => {
            applyTheme(action.payload);
            state.theme = action.payload;
        }
    }
});

export const { setIsLogged, setUsername, setIsMobile, setPath, setTheme } = globalSlice.actions;
export default globalSlice.reducer;