import React from 'react';
import Navbar from './shared/Navbar';
import { useSelector } from 'react-redux';
import { JobCard } from './Job';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const AppliedJobs = () => {
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector(store => store.job);

    // allAppliedJobs is an array of application objects, each with a .job property (internal) or a job object (external)
    const jobs = allAppliedJobs
        .map(app => app && app.job ? app.job : null)
        .filter(job => job && job._id);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-8'>
                <h1 className='text-2xl font-bold mb-2'>Applied Jobs</h1>
                <p className='mb-4 text-gray-700'>You have applied to {jobs.length} job{jobs.length !== 1 ? 's' : ''}.</p>
                {jobs.length === 0 ? (
                    <div className='text-gray-500'>No applied jobs found.</div>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
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