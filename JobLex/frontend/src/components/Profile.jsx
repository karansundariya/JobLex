import React, { useState, useEffect, useRef } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Copy, Info, FileText, UserCircle2, Check } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector, useDispatch } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setUser, setShowProfileDialog } from '@/redux/authSlice'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

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

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user, showProfileDialog} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const [keywordInput, setKeywordInput] = useState("");
    const [trackedKeywords, setTrackedKeywords] = useState(user?.trackedKeywords || []);
    const [copied, setCopied] = useState(false);
    const emailRef = useRef();

    // Profile completion logic
    const completion = getProfileCompletion(user);
    const isProfileComplete = completion.percent === 100;

    // Fetch latest profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    setTrackedKeywords(res.data.user.trackedKeywords || []);
                }
            } catch (error) {
                // Optionally handle error
            }
        };
        fetchProfile();
    }, [dispatch]);

    useEffect(() => {
        setTrackedKeywords(user?.trackedKeywords || []);
    }, [user]);

    useEffect(() => {
        if (showProfileDialog) {
            setOpen(true);
            dispatch(setShowProfileDialog(false));
        }
    }, [showProfileDialog, dispatch]);

    const handleAddKeyword = async () => {
        if (!keywordInput.trim()) return;
        try {
            const res = await axios.post(`${USER_API_END_POINT}/track-keyword`, { keyword: keywordInput.trim() }, { withCredentials: true });
            if (res.data.success) {
                setTrackedKeywords(res.data.trackedKeywords);
                setKeywordInput("");
                toast.success('Keyword added!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add keyword.');
        }
    };

    const handleRemoveKeyword = async (keyword) => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/untrack-keyword`, { keyword }, { withCredentials: true });
            if (res.data.success) {
                setTrackedKeywords(res.data.trackedKeywords);
                toast.success('Keyword removed!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove keyword.');
        }
    };

    const handleCopyEmail = () => {
        if (user?.email) {
            navigator.clipboard.writeText(user.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen pb-10 px-2 sm:px-4">
            <Navbar />
            <div className='max-w-4xl mx-auto mt-8'>
                {/* Profile Card */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-lg p-4 sm:p-8 mb-8'>
                    {/* Profile completion bar and checklist */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
                            <div className="flex-1 w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                                <div className={`h-3 rounded-full transition-all duration-500 ${isProfileComplete ? 'bg-green-500' : completion.percent >= 75 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{width: `${completion.percent}%`}}></div>
                            </div>
                            <span className={`text-sm font-semibold ${isProfileComplete ? 'text-green-600' : 'text-gray-700'}`}>{completion.percent}%</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {completion.required.map(f => (
                                <span key={f.key} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${f.value ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {f.value ? <Check className="w-4 h-4 text-green-500" /> : <Info className="w-4 h-4 text-red-400" />} {f.label}
                                </span>
                            ))}
                        </div>
                        {!isProfileComplete && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-2 flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                <span>Complete your profile to apply for jobs and unlock all features.</span>
                            </div>
                        )}
                    </div>
                    {/* Greeting and avatar */}
                    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2'>
                        <div className='flex flex-col sm:flex-row items-center gap-6 w-full'>
                            <Avatar className="h-24 w-24 border-2 border-blue-100" >
                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                            </Avatar>
                            <div className='text-center sm:text-left w-full'>
                                <h1 className='font-extrabold text-2xl text-gray-900 mb-1 flex items-center gap-2 justify-center sm:justify-start'>
                                    <UserCircle2 className="w-6 h-6 text-blue-500" />
                                    Hi, {user?.fullname?.split(' ')[0] || 'User'}!
                                </h1>
                                <p className='text-gray-600'>Welcome to your JobLex profile.</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 mt-4 md:mt-0 w-full md:w-auto" variant="outline"><Pen className="w-5 h-5" /></Button>
                    </div>
                    {/* Contact info */}
                    <div className='my-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-3'>
                            <Mail className="text-blue-600" />
                            <span ref={emailRef} className="text-gray-800 select-all">{user?.email}</span>
                            <button onClick={handleCopyEmail} className="ml-1 p-1 rounded hover:bg-blue-100 transition" title="Copy email">
                                <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                            {copied && <span className="ml-2 text-xs text-green-600">Copied!</span>}
                        </div>
                        <div className='flex items-center gap-3 relative group'>
                            <Contact className="text-blue-600" />
                            <span className="text-gray-800">{user?.phoneNumber}</span>
                            <Info className="w-4 h-4 text-gray-400 ml-1 group-hover:text-blue-500 cursor-pointer" />
                            <span className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">This is your registered phone number</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 my-4"></div>
                    {/* Skills */}
                    <div className='my-6'>
                        <h2 className='font-bold text-lg mb-2 flex items-center gap-2'><Info className="w-5 h-5 text-blue-400" /> Skills</h2>
                        <div className='flex flex-wrap items-center gap-2'>
                            {
                                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 font-semibold flex items-center gap-1"><Check className="w-4 h-4 text-blue-400" />{item}</Badge>) : <span className="text-gray-400">NA</span>
                            }
                        </div>
                    </div>
                    <div className="border-t border-gray-100 my-4"></div>
                    {/* Resume */}
                    <div className='my-6'>
                        <Label className="text-md font-bold mb-1 block flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Resume</Label>
                        {
                            user?.profile?.resume ? (
                                <a target='_blank' rel='noopener noreferrer' href={user?.profile?.resume} className='text-blue-600 hover:underline font-medium flex items-center gap-2'>
                                    <FileText className="w-4 h-4" />
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : <span className="text-gray-400">NA</span>
                        }
                    </div>
                    <div className="border-t border-gray-100 my-4"></div>
                    {/* Job Alerts */}
                    <div className='my-6'>
                        <h2 className='font-bold text-lg mb-2 flex items-center gap-2'><Info className="w-5 h-5 text-blue-400" /> Job Alerts (Email Notification)</h2>
                        <p className='text-gray-600 mb-2'>Add keywords for jobs you want to track. You'll get an email when a new job matching your interests is posted.</p>
                        <div className='flex gap-2 mb-2'>
                            <input
                                type='text'
                                value={keywordInput}
                                onChange={e => setKeywordInput(e.target.value)}
                                placeholder='e.g. Frontend Engineer'
                                className='border border-blue-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none text-gray-800 bg-white shadow-sm'
                            />
                            <Button onClick={handleAddKeyword} type='button' className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold">Add</Button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {trackedKeywords.length === 0 ? <span className='text-gray-400'>No keywords added.</span> : trackedKeywords.map((keyword, idx) => (
                                <Badge key={idx} className='flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 font-semibold'>
                                    {keyword}
                                    <Button size='icon' variant='ghost' className='p-0 ml-1 text-blue-600 hover:bg-blue-200 rounded-full' onClick={() => handleRemoveKeyword(keyword)}>
                                        ×
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Applied Jobs Table */}
                <div className='bg-white rounded-2xl shadow-sm mt-8 p-2 sm:p-6'>
                    <h2 className='font-bold text-lg my-5 px-6 pt-6'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} key={user?._id + '-' + user?.fullname + '-' + user?.phoneNumber + '-' + (user?.profile?.resume || '')} />
        </div>
    )
}

export default Profile