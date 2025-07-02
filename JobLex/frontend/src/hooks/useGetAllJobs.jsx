import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                let url = JOB_API_END_POINT + '/get';
                if (searchedQuery && searchedQuery !== 'undefined') {
                    url += `?keyword=${encodeURIComponent(searchedQuery)}`;
                }
                const res = await axios.get(url);
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
            }
        }
        fetchAllJobs();
    },[])
}

export default useGetAllJobs