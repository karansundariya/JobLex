import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { setSingleJob, updateJobInList } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setShowProfileDialog } from '@/redux/authSlice'
import Navbar from './shared/Navbar'
import { Share2 } from 'lucide-react';

// Utility function for profile completion
function getProfileCompletion(user) {
    let completed = 0;
    const required = [
        { key: 'fullname', label: 'Name', value: user?.fullname },
        { key: 'email', label: 'Email', value: user?.email },
        { key: 'phoneNumber', label: 'Mobile No', value: user?.phoneNumber },
        { key: 'resume', label: 'Resume', value: user?.profile?.resume },
    ];
    required.forEach(f => { if (f.value && String(f.value).trim() !== '') completed++; });
    return {
        percent: Math.round((completed / required.length) * 100),
        required,
        completed,
        total: required.length,
        incomplete: required.filter(f => !f.value || String(f.value).trim() === ''),
    };
}

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const [isApplied, setIsApplied] = useState(false);
    const [isMarkedApplied, setIsMarkedApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Profile completion logic
    const completion = getProfileCompletion(user);
    const isProfileComplete = completion.percent === 100;

    // Check if user has applied to this job (for internal applications)
    useEffect(() => {
        if (singleJob && user && singleJob.applicationType === 'internal') {
            const hasApplied = singleJob.applications?.some(application => application.applicant === user._id);
            setIsApplied(hasApplied);
        }
    }, [singleJob, user]);

    // Check if user has marked this job as applied (for external applications)
    useEffect(() => {
        if (singleJob && user && singleJob.applicationType === 'external') {
            checkIfMarkedApplied();
        }
    }, [singleJob, user]);

    const checkIfMarkedApplied = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/job/${jobId}/check-applied`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsMarkedApplied(res.data.isApplied);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const applyJobHandler = async () => {
        if (singleJob.applicationType === 'internal') {
            // Internal application
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
                
                if(res.data.success){
                    setIsApplied(true);
                    const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                    dispatch(setSingleJob(updatedSingleJob));
                    dispatch(updateJobInList(updatedSingleJob));
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        } else {
            // External application
            if (singleJob.careerPageUrl) {
                window.open(singleJob.careerPageUrl, '_blank');
                await markAsApplied();
            } else {
                toast.error("Career page URL not available");
            }
        }
    };

    const markAsApplied = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/job/${jobId}/mark-applied`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsMarkedApplied(true);
                // Update the job in the global jobs list for external jobs
                const updatedSingleJob = { ...singleJob, markedApplied: true };
                dispatch(updateJobInList(updatedSingleJob));
                toast.success("Job marked as applied!");
            }
        } catch (error) {
            if (error.response?.data?.message === "Job already marked as applied") {
                setIsMarkedApplied(true);
            } else {
                toast.error("Failed to mark job as applied");
            }
        } finally {
            setLoading(false);
        }
    };

    // Blocked action handler
    const handleBlockedAction = (e) => {
        e?.stopPropagation && e.stopPropagation();
        dispatch(setShowProfileDialog(true));
        toast.warning('Please complete your profile to apply for jobs.');
    };

    const getApplyButton = () => {
        if (!singleJob) return null;
        if (!user) {
            return (
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => navigate('/login')}
                >
                    Login to Apply
                </Button>
            );
        }
        if (!isProfileComplete) {
            return (
                <Button
                    variant="outline"
                    className='border-red-500 text-red-600 bg-red-50 font-semibold cursor-not-allowed'
                    onClick={handleBlockedAction}
                    title="Complete your profile to apply"
                >
                    Complete Profile to Apply
                </Button>
            );
        }
        if (singleJob.applicationType === 'internal') {
            if (isApplied) {
                return (
                    <Button disabled className="bg-gray-600 cursor-not-allowed">
                        Already Applied
                    </Button>
                );
            } else {
                return (
                    <Button onClick={applyJobHandler} className="bg-[#7209b7] hover:bg-[#5f32ad]">
                        Apply Now
                    </Button>
                );
            }
        } else {
            // External application
            if (isMarkedApplied) {
                return (
                    <Button disabled className="bg-gray-600 cursor-not-allowed">
                        Already Applied
                    </Button>
                );
            } else {
                return (
                    <Button 
                        onClick={applyJobHandler} 
                        disabled={loading}
                        className="bg-[#7209b7] hover:bg-[#5f32ad]"
                    >
                        {loading ? "Marking..." : "Apply on Company Website"}
                    </Button>
                );
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.delete(`${JOB_API_END_POINT}/${jobId}`, { withCredentials: true });
            toast.success('Job deleted successfully!');
            navigate('/admin/jobs');
        } catch (error) {
            toast.error('Failed to delete job.');
        }
    };

    // Share button handler
    const handleShare = () => {
        const url = window.location.origin + '/description/' + jobId;
        if (navigator.share) {
            navigator.share({
                title: singleJob?.title,
                text: `Check out this job: ${singleJob?.title} at ${singleJob?.company?.name || ''}`,
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch]);

    if (!singleJob) {
        return <div className="text-center py-10">Loading job details...</div>;
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-3xl mx-auto my-10 bg-white rounded-2xl shadow-md p-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                    <div>
                        <div className="flex gap-2 items-center mb-4">
                            <h1 className="text-3xl font-bold text-blue-900 flex-1">{singleJob?.title}</h1>
                            <Button onClick={handleShare} variant="outline" className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Share2 className="w-5 h-5" /> Share
                            </Button>
                        </div>
                        {singleJob?.company && (
                            <div className='flex items-center gap-2 mb-1'>
                                <span className='text-lg text-gray-600 font-semibold'>{singleJob.company.name}</span>
                                {singleJob.company.website && (
                                    <a
                                        href={singleJob.company.website.startsWith('http') ? singleJob.company.website : `https://${singleJob.company.website}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 hover:underline text-sm ml-2'
                                    >
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        )}
                        <div className='flex flex-wrap items-center gap-2 mt-2'>
                            <Badge className={'text-blue-700 font-bold'} variant="ghost">
                                {singleJob?.position && singleJob.position !== "Not Disclosed" ? `${singleJob.position} Positions` : 'Not Disclosed'}
                            </Badge>
                            <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
                                {singleJob?.salary && singleJob.salary !== "Not Disclosed" ? `${singleJob.salary} LPA` : 'Not Disclosed'}
                            </Badge>
                            {singleJob?.applicationType === 'external' && (
                                <Badge className={'text-green-700 font-bold'} variant="ghost">External Application</Badge>
                            )}
                            {singleJob?.status && (
                                <Badge className={singleJob.status === 'open' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} variant="default">
                                    {singleJob.status.charAt(0).toUpperCase() + singleJob.status.slice(1)}
                                </Badge>
                            )}
                            {singleJob?.expiryDate && (
                                <Badge className='bg-gray-200 text-gray-700' variant="ghost">
                                    Expires: {new Date(singleJob.expiryDate).toLocaleDateString()}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                        {getApplyButton()}
                        {user && singleJob && user._id === singleJob.created_by && (
                            <Button
                                variant="destructive"
                                className="mt-2"
                                onClick={handleDelete}
                            >
                                Delete Job
                            </Button>
                        )}
                    </div>
                </div>
                <div className='border-b border-gray-200 mb-6'></div>
                <h2 className='font-semibold text-lg text-gray-800 mb-2'>Job Description</h2>
                <div className='mb-6'>
                    <p className='text-gray-700 leading-relaxed'>{singleJob?.description}</p>
                </div>
                <h2 className='font-semibold text-lg text-gray-800 mb-2'>Requirements</h2>
                <div className='mb-6'>
                    <ul className='list-disc list-inside space-y-2'>
                        {singleJob?.requirements?.map((requirement, index) => (
                            <li key={index} className='text-gray-700'>{requirement}</li>
                        ))}
                    </ul>
                </div>
                {singleJob?.applicationType === 'external' && singleJob?.careerPageUrl && (
                    <div className='my-5 p-4 bg-blue-50 rounded-lg'>
                        <h2 className='font-semibold text-blue-800 mb-2'>External Application</h2>
                        <p className='text-blue-700 mb-3'>This job requires you to apply on the company's website.</p>
                        <a 
                            href={singleJob.careerPageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='text-blue-600 hover:underline font-medium'
                        >
                            View Career Page →
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobDescription