import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])

    const handleDelete = async (companyId) => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await axios.delete(`${COMPANY_API_END_POINT}/${companyId}`, { withCredentials: true });
            setFilterCompany(filterCompany.filter(c => c._id !== companyId));
            toast.success('Company deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete company.');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-6 max-w-5xl mx-auto mt-8 overflow-x-auto">
            <Table>
                <TableCaption className="text-gray-500">A list of your recently registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-gray-700 font-semibold">Logo</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-400 py-8">No companies found.</TableCell>
                            </TableRow>
                        ) : filterCompany?.map((company) => (
                            <TableRow key={company._id} className="hover:bg-blue-50/40 transition">
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo || 'https://ui-avatars.com/api/?name=Company&background=eee&color=888&size=64'} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">{company.name}</TableCell>
                                <TableCell className="text-gray-700">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-36 rounded-xl shadow-lg border border-gray-100">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full mt-2 rounded-full"
                                                onClick={() => handleDelete(company._id)}
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

export default CompaniesTable