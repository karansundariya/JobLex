import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useGetAllJobs();

    // Jobs logic improved
    useEffect(() => {
        let filtered = allJobs.filter(job => !!job); // Remove undefined/null jobs

        // If only text is set, do a broad search
        if (filters.text && !filters.location && !filters.industry && !filters.salary) {
            const text = filters.text.toLowerCase();
            filtered = filtered.filter(job =>
                (job.title && job.title.toLowerCase().includes(text)) ||
                (job.description && job.description.toLowerCase().includes(text)) ||
                (job.location && job.location.toLowerCase().includes(text))
            );
        } else {
            if (filters.location) {
                filtered = filtered.filter(job => job.location && job.location.toLowerCase() === filters.location.toLowerCase());
            }
            if (filters.industry) {
                filtered = filtered.filter(job => job.title && job.title.toLowerCase().includes(filters.industry.toLowerCase()));
            }
            if (filters.salary) {
                filtered = filtered.filter(job => {
                    if (!job.salary || job.salary === "Not Disclosed" || isNaN(Number(job.salary))) return false;
                    const salary = Number(job.salary);
                    if (filters.salary === "0-40k") return salary >= 0 && salary <= 0.4;
                    if (filters.salary === "42-1lakh") return salary > 0.4 && salary <= 1;
                    if (filters.salary === "1lakh to 5lakh") return salary > 1 && salary <= 5;
                    return true;
                });
            }
            if (filters.text) {
                const text = filters.text.toLowerCase();
                filtered = filtered.filter(job =>
                    (job.title && job.title.toLowerCase().includes(text)) ||
                    (job.description && job.description.toLowerCase().includes(text)) ||
                    (job.location && job.location.toLowerCase().includes(text))
                );
            }
        }
        setFilterJobs(filtered);
    }, [allJobs, filters]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-2 sm:px-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>All Jobs</h2>
                    <div className='flex gap-4'>
                        <Link to="/saved-jobs" className="text-blue-600 hover:underline font-medium">View Saved Jobs</Link>
                        <Link to="/applied-jobs" className="text-blue-600 hover:underline font-medium">View Applied Jobs</Link>
                    </div>
                </div>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs