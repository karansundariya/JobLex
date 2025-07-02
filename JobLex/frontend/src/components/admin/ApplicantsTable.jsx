import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-6 max-w-5xl mx-auto mt-8 overflow-x-auto">
            <Table>
                <TableCaption className="text-gray-500">A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-gray-700 font-semibold">FullName</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Resume</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !applicants?.applications?.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-8">No applicants found.</TableCell>
                            </TableRow>
                        ) : applicants?.applications?.map((item) => (
                            <TableRow key={item._id} className="hover:bg-blue-50/40 transition">
                                <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname}</TableCell>
                                <TableCell className="text-gray-700">{item?.applicant?.email}</TableCell>
                                <TableCell className="text-gray-700">{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer hover:underline" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span className="text-gray-400">NA</span>
                                    }
                                </TableCell>
                                <TableCell className="text-gray-700">{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-36 rounded-xl shadow-lg border border-gray-100">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
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

export default ApplicantsTable