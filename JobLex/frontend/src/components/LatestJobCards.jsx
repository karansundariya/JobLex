import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setShowProfileDialog } from '@/redux/authSlice'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    // Profile completion logic
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

    return (
        <div
            onClick={handleDetailsClick}
            className="group p-5 rounded-2xl bg-white border-2 border-transparent shadow-xl hover:shadow-2xl hover:border-blue-300 transition cursor-pointer flex flex-col h-full relative overflow-hidden"
            style={{ minHeight: 240 }}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center overflow-hidden border border-blue-200">
                    {job?.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-10 h-10 object-cover rounded-full" />
                    ) : (
                        <span className="text-2xl text-blue-500 font-bold">{job?.company?.name?.[0] || '?'}</span>
                    )}
                </div>
                <div>
                    <h1 className="font-semibold text-base text-blue-900">{job?.company?.name}</h1>
                    <p className="text-xs text-gray-500">India</p>
                </div>
            </div>
            <div className="flex-1">
                <h1 className="font-bold text-lg my-1 text-blue-800 line-clamp-1">{job?.title}</h1>
                <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <button
                onClick={handleDetailsClick}
                className="mt-5 w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow hover:scale-105 transition group-hover:from-blue-700 group-hover:to-green-600"
                style={{ letterSpacing: 1 }}
            >
                View Details
            </button>
            <div className="absolute inset-0 pointer-events-none rounded-2xl group-hover:ring-2 group-hover:ring-blue-200 transition"></div>
        </div>
    )
}

export default LatestJobCards