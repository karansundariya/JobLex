import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: "",
        applicationType: "internal",
        careerPageUrl: "",
        expiryDate: ""
    });
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany?._id || ""});
    };

    const applicationTypeChangeHandler = (value) => {
        setInput({...input, applicationType: value});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job');
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Post a New Job</h1>
                    <p className='text-gray-500'>Fill in the details below to post a new job opening.</p>
                </div>
                <form onSubmit={submitHandler} className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            <Select onValueChange={selectChangeHandler} value={(() => {
                                const selected = companies.find(c => c._id === input.companyId);
                                return selected ? selected.name.toLowerCase() : undefined;
                            })()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label>Job Description</Label>
                        <textarea
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Describe the role and responsibilities..."
                            className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Requirements (comma-separated)</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>
                        <div>
                            <Label>Salary (LPA) (Optional)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="12"
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="Mumbai, India"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select onValueChange={(value) => setInput({...input, jobType: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience (Years)</Label>
                            <Input
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                placeholder="2"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Number of Positions (Optional)</Label>
                        <Input
                            type="number"
                            name="position"
                            value={input.position}
                            onChange={changeEventHandler}
                            placeholder="5"
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Application Type</Label>
                            <Select onValueChange={applicationTypeChangeHandler} value={input.applicationType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select application type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Apply through our portal</SelectItem>
                                    <SelectItem value="external">Apply on company website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {input.applicationType === 'external' && (
                            <div>
                                <Label>Career Page URL</Label>
                                <Input
                                    type="url"
                                    name="careerPageUrl"
                                    value={input.careerPageUrl}
                                    onChange={changeEventHandler}
                                    placeholder="https://company.com/careers/job-id"
                                />
                            </div>
                        )}
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Expiry Date (Optional)</Label>
                            <Input
                                type="date"
                                name="expiryDate"
                                value={input.expiryDate}
                                onChange={changeEventHandler}
                            />
                        </div>
                    </div>
                    {
                        loading ? 
                        <Button className="w-full" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                            Posting Job...
                        </Button> 
                        : 
                        <Button type="submit" className="w-full">
                            Post Job
                        </Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob