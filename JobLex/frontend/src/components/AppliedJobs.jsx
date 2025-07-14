import React from 'react';
import Navbar from './shared/Navbar';
import { useSelector } from 'react-redux';
import { JobCard } from './Job';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const AppliedJobs = () => {
    // Applied jobs fetching logic updated
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector(store => store.job);

    // allAppliedJobs is an array of application objects, each with a .job property (internal) or a job object (external)
    const jobs = allAppliedJobs
        .map(app => app && app.job ? app.job : null)
        .filter(job => job && job._id);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 sm:mt-8 px-4'>
                <div className='mb-6'>
                    <h1 className='text-xl sm:text-2xl font-bold mb-2'>Applied Jobs</h1>
                    <p className='mb-4 text-gray-700 text-sm sm:text-base'>
                        You have applied to {jobs.length} job{jobs.length !== 1 ? 's' : ''}.
                    </p>
                </div>
                
                {jobs.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-500 text-lg font-medium mb-4'>
                            No applied jobs found.
                        </div>
                        <p className='text-gray-400 text-sm'>
                            Start applying to jobs to see them here.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} forceApplied={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs; 