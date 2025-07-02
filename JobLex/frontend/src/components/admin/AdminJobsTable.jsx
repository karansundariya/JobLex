import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.delete(`${JOB_API_END_POINT}/${jobId}`, { withCredentials: true });
            setFilterJobs(filterJobs.filter(j => j._id !== jobId));
            toast.success('Job deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete job.');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-6 max-w-5xl mx-auto mt-8 overflow-x-auto">
            <Table>
                <TableCaption className="text-gray-500">A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-gray-700 font-semibold">Company Name</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Role</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-400 py-8">No jobs found.</TableCell>
                            </TableRow>
                        ) : filterJobs?.map((job) => (
                            <TableRow key={job._id} className="hover:bg-blue-50/40 transition">
                                <TableCell className="font-medium text-gray-900">{job?.company?.name}</TableCell>
                                <TableCell className="text-gray-700">{job?.title}</TableCell>
                                <TableCell className="text-gray-700">{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-36 rounded-xl shadow-lg border border-gray-100">
                                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2 hover:bg-blue-50 px-2 py-1 rounded'>
                                                <Eye className='w-4'/>
                                                <span>Applicants</span>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full mt-2 rounded-full"
                                                onClick={() => handleDelete(job._id)}
                                            >
                                                Delete
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable