import React, { useEffect, useRef, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setFilters } from '@/redux/jobSlice';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, filters } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const inputRef = useRef();

    // On mount or when ?search= changes, set searchQuery and filters.text
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const companyParam = params.get('company');
        const searchParam = params.get('search');
        if (companyParam) {
            setSearchQuery(companyParam);
            dispatch(setFilters({ ...filters, text: '' }));
        } else if (searchParam !== null) {
            setSearchQuery(searchParam);
            dispatch(setFilters({ ...filters, text: searchParam }));
        } else {
            setSearchQuery(filters.text || '');
        }
        // eslint-disable-next-line
    }, [location.search]);

    useEffect(() => {
        let filtered = allJobs.filter(job => !!job);
        const params = new URLSearchParams(location.search);
        const companyParam = params.get('company');
        if (companyParam) {
            filtered = filtered.filter(job => job.company && job.company.name && job.company.name.toLowerCase() === companyParam.toLowerCase());
        } else if (searchQuery) {
            const fuse = new Fuse(filtered, {
                keys: [
                    'title',
                    'description',
                    'location',
                    'company.name'
                ],
                threshold: 0.35,
                minMatchCharLength: 2,
            });
            filtered = fuse.search(searchQuery).map(result => result.item);
        }
        // Other filters
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
        setFilterJobs(filtered);
    }, [allJobs, filters, searchQuery, location.search]);

    // Handle search bar input
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearch = () => {
        dispatch(setFilters({ ...filters, text: searchQuery }));
        inputRef.current && inputRef.current.blur();
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-2 sm:px-4'>
                <div className="flex flex-col items-center mb-8">
                    <div className="flex w-full max-w-xl mx-auto rounded-full border border-blue-200 bg-white shadow-lg items-center gap-2 px-4 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 focus-within:scale-105">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder='Search jobs, companies, or skills...'
                            className='outline-none border-none w-full bg-transparent text-lg px-2 py-2 rounded-l-full placeholder:text-gray-400 focus:ring-0 focus:outline-none'
                        />
                        <Button onClick={handleSearch} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg font-semibold flex items-center gap-2 shadow-md transition-transform duration-150 active:scale-95">
                            <Search className='h-5 w-5 transition-transform duration-200 group-focus-within:scale-110' />
                            Search
                        </Button>
                    </div>
                </div>
                <h1 className='font-bold text-xl my-10'>Search Results ({filterJobs.length})</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {
                        filterJobs.length === 0 ? <span>No jobs found.</span> : filterJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse