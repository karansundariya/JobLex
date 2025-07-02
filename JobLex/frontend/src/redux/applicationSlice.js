import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
        appliedJobs:[],
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        setAppliedJobs:(state,action) => {
            state.appliedJobs = action.payload;
        }
    }
});
export const {setAllApplicants, setAppliedJobs} = applicationSlice.actions;
export default applicationSlice.reducer;