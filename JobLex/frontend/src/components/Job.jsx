import React, { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setSavedJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'
import { setShowProfileDialog } from '@/redux/authSlice'
import { Share2 } from 'lucide-react'

const Job = ({ job, showSavedBadge = true, forceApplied = false, forceCheckApplied = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { savedJobs } = useSelector(store => store.job);
    const [isApplied, setIsApplied] = useState(false);
    const [isMarkedApplied, setIsMarkedApplied] = useState(false);
    const [saving, setSaving] = useState(false);

    // Always check application status via API if forceCheckApplied is true
    useEffect(() => {
        if (!user) return;
        if (forceCheckApplied) {
            // Check for both internal and external jobs
            checkIfAppliedAPI();
        } else {
            // Default logic
            if (job.applicationType === 'internal') {
                const hasApplied = job.applications?.some(application => {
                    const applicantId = typeof application.applicant === 'object' 
                        ? application.applicant._id 
                        : application.applicant;
                    return applicantId === user._id;
                });
                setIsApplied(hasApplied);
            }
            if (job.applicationType === 'external') {
                checkIfMarkedApplied();
            }
        }
    }, [job, user, forceCheckApplied]);

    // Helper to check applied status via API for both job types
    const checkIfAppliedAPI = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/job/${job._id}/check-applied`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsApplied(res.data.isApplied);
                setIsMarkedApplied(res.data.isApplied);
            }
        } catch (error) {
            setIsApplied(false);
            setIsMarkedApplied(false);
        }
    };

    // Fetch saved jobs on mount (optional, for up-to-date state)
    useEffect(() => {
        if (user) fetchSavedJobs();
    }, [user]);

    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setSavedJobs(res.data.jobs.map(j => j._id)));
            }
        } catch (error) {
            // ignore
        }
    };

    const checkIfMarkedApplied = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/job/${job._id}/check-applied`, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsMarkedApplied(res.data.isApplied);
            }
        } catch (error) {
            setIsMarkedApplied(false);
        }
    };

    const hasUserApplied = () => {
        if (forceApplied) return true;
        return isApplied || isMarkedApplied;
    };

    const isSaved = savedJobs && savedJobs.includes(job._id);

    const handleSave = async (e) => {
        e.stopPropagation();
        if (isSaved || saving) return;
        setSaving(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/job/${job._id}/save`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setSavedJobs([...(savedJobs || []), job._id]));
                toast.success('Job saved for later!');
            }
        } catch (error) {
            toast.error('Failed to save job.');
        } finally {
            setSaving(false);
        }
    };

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

    const completion = getProfileCompletion(user);
    const isProfileComplete = completion.percent === 100;

    // Blocked action handler
    const handleBlockedAction = (e) => {
        e.stopPropagation();
        dispatch(setShowProfileDialog(true));
        toast.warning('Please complete your profile to apply for jobs.');
    };

    // Handler for Details button click
    const handleDetailsClick = (e) => {
        e?.stopPropagation && e.stopPropagation();
        if (!user) {
            toast.warning('Please login or signup to view job details.');
            setTimeout(() => navigate('/login'), 100);
            return;
        }
        if (!isProfileComplete) {
            toast.warning('Please complete your profile to view job details.');
            dispatch(setShowProfileDialog(true));
            setTimeout(() => navigate('/profile'), 100);
            return;
        }
        navigate(`/description/${job._id}`);
    };

    // Share button handler
    const handleShare = (e) => {
        e.stopPropagation && e.stopPropagation();
        const url = window.location.origin + '/description/' + job._id;
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: `Check out this job: ${job.title} at ${job.company?.name || ''}`,
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <div 
            className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 relative flex flex-col min-h-[260px] w-full max-w-full overflow-hidden'
        >
            {showSavedBadge && isSaved && (
                <Badge className='bg-yellow-400 text-black font-bold absolute top-3 right-3 z-10' variant="default">Saved</Badge>
            )}
            <div className='flex-1'>
                <h1 className='font-extrabold text-xl mb-1 text-gray-900'>{job?.title}</h1>
                {job?.company && job.company.name && (
                  <div className='text-sm text-gray-500 font-medium mb-1'>
                    {job.company.name}
                  </div>
                )}
                <p className='text-base text-gray-600 line-clamp-3'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 bg-blue-50 font-semibold'} variant="ghost">
                    {job?.position && job.position !== "Not Disclosed" ? `${job.position} Positions` : 'Not Disclosed'}
                </Badge>
                <Badge className={'text-gray-700 bg-gray-100 font-semibold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-purple-700 bg-purple-50 font-semibold'} variant="ghost">
                    {job?.salary && job.salary !== "Not Disclosed" ? `${job.salary} LPA` : 'Not Disclosed'}
                </Badge>
                {job?.applicationType === 'external' && (
                    <Badge className={'text-green-700 bg-green-50 font-semibold'} variant="ghost">External</Badge>
                )}
                {job?.status && (
                    <Badge className={job.status === 'open' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'} variant="default">
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                )}
                {job?.expiryDate && (
                    <Badge className='bg-gray-200 text-gray-700 max-w-[160px] truncate' variant="ghost">
                        Expires: {new Date(job.expiryDate).toLocaleDateString()}
                    </Badge>
                )}
            </div>
            <div className='flex flex-row flex-wrap items-center gap-3 mt-6 w-full'>
                <Button
                    key={String(isApplied) + '-' + String(isMarkedApplied)}
                    variant="outline"
                    className={
                        !isProfileComplete
                            ? 'border-red-500 text-red-600 bg-red-50 font-semibold cursor-not-allowed opacity-70'
                            : hasUserApplied()
                                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    }
                    style={{ minWidth: 120 }}
                    onClick={handleDetailsClick}
                    title={!user ? 'Login required' : !isProfileComplete ? 'Complete your profile to apply for jobs' : hasUserApplied() ? 'Already Applied' : 'View job details'}
                    disabled={false}
                >
                    {!user ? 'Login to View' : !isProfileComplete ? 'Complete Profile to Apply' : hasUserApplied() ? 'Already Applied' : 'Details'}
                </Button>
                <Button
                    className={
                        !isProfileComplete
                            ? 'bg-gray-200 text-gray-400 font-semibold cursor-not-allowed opacity-70 min-w-[140px]'
                            : isSaved
                                ? 'bg-yellow-400 text-black font-semibold min-w-[140px]'
                                : 'bg-blue-600 text-white font-semibold hover:bg-blue-700 min-w-[140px]'
                    }
                    onClick={
                        !isProfileComplete ? handleBlockedAction : handleSave
                    }
                    disabled={!isProfileComplete || isSaved || saving}
                    title={!isProfileComplete ? 'Complete your profile to save jobs' : isSaved ? 'Already saved' : 'Save this job for later'}
                >
                    {isSaved ? 'Saved' : saving ? 'Saving...' : 'Save For Later'}
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Share2 className="w-4 h-4" /> Share
                </Button>
            </div>
        </div>
    )
}

export default Job;
export { Job as JobCard };