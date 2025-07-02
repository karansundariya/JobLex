import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        filters: {
            location: '',
            industry: '',
            salary: '',
            text: ''
        },
        savedJobs:[],
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setFilters:(state,action) => {
            state.filters = action.payload;
        },
        setSavedJobs:(state,action) => {
            state.savedJobs = action.payload;
        },
        updateJobInList: (state, action) => {
            const updatedJob = action.payload;
            state.allJobs = state.allJobs.map(job =>
                job._id === updatedJob._id ? updatedJob : job
            );
        },
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setFilters,
    setSavedJobs,
    updateJobInList
} = jobSlice.actions;
export default jobSlice.reducer;