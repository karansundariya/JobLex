import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            <div className='max-w-7xl mx-auto my-6 sm:my-10 px-4'>
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                    <h2 className='text-xl sm:text-2xl font-bold'>All Jobs</h2>
                    <div className='flex flex-wrap gap-3 sm:gap-4'>
                        <Link to="/saved-jobs" className="text-blue-600 hover:underline font-medium text-sm sm:text-base">View Saved Jobs</Link>
                        <Link to="/applied-jobs" className="text-blue-600 hover:underline font-medium text-sm sm:text-base">View Applied Jobs</Link>
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className='md:hidden mb-4'>
                    <Button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 py-3"
                    >
                        <Filter size={20} />
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-6'>
                    {/* Filter Section */}
                    <div className={`lg:w-80 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className='lg:hidden mb-4 flex justify-between items-center'>
                            <h3 className='font-semibold text-lg'>Filters</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2"
                            >
                                <X size={20} />
                            </Button>
                        </div>
                        <FilterCard />
                    </div>

                    {/* Jobs Grid Section */}
                    <div className='flex-1'>
                        {filterJobs.length <= 0 ? (
                            <div className='text-center py-12'>
                                <span className='text-gray-500 text-lg'>No jobs found</span>
                            </div>
                        ) : (
                            <div className='h-[calc(100vh-200px)] sm:h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                                    {filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs