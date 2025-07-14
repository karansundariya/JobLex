import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, Clock, Globe2, Calendar, Building, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const fallbackLogo = "https://ui-avatars.com/api/?name=Company&background=eee&color=888&size=64";

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);

    // Summary counts
    const total = allAppliedJobs.length;
    const accepted = allAppliedJobs.filter(j => j.type === 'internal' && j.status === 'accepted').length;
    const rejected = allAppliedJobs.filter(j => j.type === 'internal' && j.status === 'rejected').length;
    const pending = allAppliedJobs.filter(j => j.type === 'internal' && (!j.status || j.status === 'pending')).length;
    const external = allAppliedJobs.filter(j => j.type === 'external').length;

    // Helper function to get status info
    const getStatusInfo = (appliedJob) => {
        if (appliedJob.type === 'internal') {
            let color = 'bg-gray-200 text-gray-700';
            let icon = <Clock className="w-4 h-4" />;
            let label = 'Pending';
            if (appliedJob.status === 'rejected') {
                color = 'bg-red-100 text-red-700';
                icon = <XCircle className="w-4 h-4" />;
                label = 'Rejected';
            }
            if (appliedJob.status === 'accepted') {
                color = 'bg-green-100 text-green-700';
                icon = <CheckCircle className="w-4 h-4" />;
                label = 'Accepted';
            }
            return { color, icon, label };
        } else {
            return {
                color: 'bg-blue-100 text-blue-700',
                icon: <Globe2 className="w-4 h-4" />,
                label: 'Externally applied'
            };
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-4 sm:p-8 max-w-4xl mx-auto mt-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-2 sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Applied Jobs</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-end">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                        <Globe2 className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        <span className="hidden sm:inline">External:</span> {external}
                    </span>
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        <span className="hidden sm:inline">Accepted:</span> {accepted}
                    </span>
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        <span className="hidden sm:inline">Pending:</span> {pending}
                    </span>
                    <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        <span className="hidden sm:inline">Rejected:</span> {rejected}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                        <span className="hidden sm:inline">Total:</span> {total}
                    </span>
                </div>
            </div>

            {/* Empty State */}
            {allAppliedJobs.length <= 0 && (
                <div className="text-center text-gray-400 py-12">
                    <div className="flex flex-col items-center gap-4">
                        <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/briefcase.svg" alt="No jobs" className="w-16 h-16 opacity-60" />
                        <div className="text-lg font-semibold">You haven't applied to any jobs yet.</div>
                        <Link to="/browse" className="mt-2 inline-block bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition">
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
                {allAppliedJobs.map((appliedJob, idx) => {
                    const statusInfo = getStatusInfo(appliedJob);
                    return (
                        <div key={appliedJob._id || appliedJob.job?._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <img 
                                        src={appliedJob.job?.company?.logo || fallbackLogo} 
                                        alt="logo" 
                                        className="w-10 h-10 rounded-full border border-gray-200 object-cover shrink-0" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {appliedJob.job?.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                            <Building className="w-3 h-3" />
                                            {appliedJob.job?.company?.name}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                                    {statusInfo.icon}
                                    <span className="hidden sm:inline">{statusInfo.label}</span>
                                </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{appliedJob?.createdAt?.split("T")[0]}</span>
                                </div>
                                <Link 
                                    to={`/description/${appliedJob.job?._id}`} 
                                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition text-xs"
                                >
                                    <Eye className="w-3 h-3" />
                                    <span className="hidden sm:inline">View</span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <Table className="min-w-[600px] w-full">
                    <TableCaption className="text-gray-500">A list of your applied jobs</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-100">
                            <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                            <TableHead className="text-gray-700 font-semibold">Job Role</TableHead>
                            <TableHead className="text-gray-700 font-semibold">Company</TableHead>
                            <TableHead className="text-right text-gray-700 font-semibold">Status</TableHead>
                            <TableHead className="sr-only">View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allAppliedJobs.map((appliedJob, idx) => {
                            const isLast = idx === allAppliedJobs.length - 1;
                            const statusInfo = getStatusInfo(appliedJob);
                            
                            return (
                                <TableRow key={appliedJob._id || appliedJob.job?._id} className={`group cursor-pointer ${!isLast ? 'border-b border-gray-100' : ''} transition hover:bg-blue-50/60`}>
                                    <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className="font-medium text-gray-900 group-hover:underline flex items-center gap-2 max-w-[180px] truncate">
                                        <img src={appliedJob.job?.company?.logo || fallbackLogo} alt="logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0" />
                                        <Link to={`/description/${appliedJob.job?._id}`} className="hover:text-blue-700 transition-colors truncate" aria-label={`View details for ${appliedJob.job?.title}`}>
                                            {appliedJob.job?.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-gray-700 max-w-[120px] truncate">{appliedJob.job?.company?.name}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="relative group">
                                            <Badge className={`rounded-full px-4 py-1 text-base font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                {statusInfo.label}
                                            </Badge>
                                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                                                {statusInfo.label} ({appliedJob.type === 'internal' ? 'Internal application' : 'Marked as applied externally'})
                                            </span>
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/description/${appliedJob.job?._id}`} className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition text-xs" aria-label={`View job ${appliedJob.job?.title}`}>
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AppliedJobTable