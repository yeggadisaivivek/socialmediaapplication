import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userId: localStorage.getItem('userId'),
    username: ''
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        login: (state,action) => {
            state.status = true;
            state.userId = action.payload.userId;
        },
        logout: (state,action) => {
            state.status = false;
            state.userId = null;
            localStorage.removeItem('userId'),
            state.username = '';
        },
        setUsername: (state,action) => {
            state.username = action.payload.username;
        }
    }
})

export const { login, logout, setUsername } = authSlice.actions;
export default authSlice.reducer;