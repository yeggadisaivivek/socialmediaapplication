import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        login: (state,action) => {
            state.status = true;
        },
        logout: (state,action) => {
            state.status = false;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;