import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                window.location.href = "/admin/companies";
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await axios.delete(`${COMPANY_API_END_POINT}/${params.id}`, { withCredentials: true });
            toast.success('Company deleted successfully!');
            navigate('/admin/companies');
        } catch (error) {
            toast.error('Failed to delete company.');
        }
    };

    useEffect(() => {
        if (!params.id) return;
        setFetching(true);
        setFetchError(null);
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${params.id}`, { withCredentials: true });
                if (res.data.success && res.data.company) {
                    setInput({
                        name: res.data.company.name || "",
                        description: res.data.company.description || "",
                        website: res.data.company.website || "",
                        location: res.data.company.location || "",
                        file: null
                    });
                } else {
                    setFetchError("Company not found.");
                }
            } catch (error) {
                setFetchError("Failed to load company data.");
            } finally {
                setFetching(false);
            }
        };
        fetchCompany();
    }, [params.id]);

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <span className="text-lg text-gray-600">Loading company data...</span>
                </div>
            </div>
        );
    }
    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-lg text-red-600">{fetchError}</span>
                    <Button className="mt-4" onClick={() => navigate('/admin/companies')}>Back to Companies</Button>
                </div>
            </div>
        );
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                    <Button
                        variant="destructive"
                        className="w-full my-2"
                        onClick={handleDelete}
                    >
                        Delete Company
                    </Button>
                </form>
            </div>

        </div>
    )
}

export default CompanySetup