import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    username: ""
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
        }
    }
});

export const { setIsLogged, setUsername } = globalSlice.actions;
export default globalSlice.reducer;