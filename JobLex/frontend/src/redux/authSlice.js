import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        showProfileDialog: false
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setShowProfileDialog:(state, action) => {
            state.showProfileDialog = action.payload;
        }
    }
});
export const {setLoading, setUser, setShowProfileDialog} = authSlice.actions;
export default authSlice.reducer;