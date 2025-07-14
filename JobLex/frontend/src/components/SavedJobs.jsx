import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedJobs } from '@/redux/jobSlice';
import { SAVED_JOBS_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import Navbar from './shared/Navbar';
import { JobCard } from './Job';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const SavedJobs = () => {
    const dispatch = useDispatch();
    const { savedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [jobs, setJobs] = React.useState([]);
    const [unsaving, setUnsaving] = React.useState(null);
    const [appliedMap, setAppliedMap] = React.useState({});

    useEffect(() => {
        fetchSavedJobs();
        // Refetch when page regains focus
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchSavedJobs();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get(SAVED_JOBS_API_END_POINT, { withCredentials: true });
            if (res.data.success) {
                setJobs(res.data.jobs);
                dispatch(setSavedJobs(res.data.jobs.map(j => j._id)));
                fetchAppliedStatuses(res.data.jobs);
            }
        } catch (error) {
            setJobs([]);
            setAppliedMap({});
        }
    };

    // Fetch applied status for all jobs in parallel
    const fetchAppliedStatuses = async (jobsList) => {
        if (!user) return;
        const statusMap = {};
        await Promise.all(jobsList.map(async (job) => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/job/${job._id}/check-applied`, { withCredentials: true });
                statusMap[job._id] = res.data.success ? res.data.isApplied : false;
            } catch {
                statusMap[job._id] = false;
            }
        }));
        setAppliedMap(statusMap);
    };

    const handleUnsave = async (jobId) => {
        setUnsaving(jobId);
        try {
            await axios.post(`${USER_API_END_POINT}/job/${jobId}/unsave`, {}, { withCredentials: true });
            await fetchSavedJobs();
            toast.success('Job removed from saved!');
        } catch (error) {
            toast.error('Failed to unsave job.');
        } finally {
            setUnsaving(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 sm:mt-8 px-4'>
                <div className='mb-6'>
                    <h1 className='text-xl sm:text-2xl font-bold mb-2'>Saved Jobs</h1>
                    <p className='mb-4 text-gray-700 text-sm sm:text-base'>
                        You have saved {jobs.length} job{jobs.length !== 1 ? 's' : ''}.
                    </p>
                </div>
                
                {jobs.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-500 text-lg font-medium mb-4'>
                            No saved jobs found.
                        </div>
                        <p className='text-gray-400 text-sm'>
                            Save jobs to see them here.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                        {jobs.map(job => (
                            <div key={job._id + '-' + (user?._id || '')} className="relative">
                                <JobCard job={job} showSavedBadge={false} forceApplied={appliedMap[job._id]} />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 z-10 min-h-[32px] px-2 sm:px-3 text-xs sm:text-sm"
                                    onClick={() => handleUnsave(job._id)}
                                    disabled={unsaving === job._id}
                                >
                                    {unsaving === job._id ? (
                                        'Removing...'
                                    ) : (
                                        <>
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            <span className="hidden sm:inline">Unsave</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs; 