import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, Clock, Globe2 } from 'lucide-react'
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

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 sm:p-8 max-w-4xl mx-auto mt-8 overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-2 sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 pb-2">
                <h2 className="text-xl font-bold text-gray-900">Your Applied Jobs</h2>
                <div className="flex flex-wrap gap-3 text-sm w-full sm:w-auto justify-center sm:justify-end">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold"><Globe2 className="w-4 h-4" /> External: {external}</span>
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold"><CheckCircle className="w-4 h-4" /> Accepted: {accepted}</span>
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-semibold"><Clock className="w-4 h-4" /> Pending: {pending}</span>
                    <span className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full font-semibold"><XCircle className="w-4 h-4" /> Rejected: {rejected}</span>
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">Total: {total}</span>
                </div>
            </div>
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
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/briefcase.svg" alt="No jobs" className="w-16 h-16 opacity-60" />
                                        <div className="text-lg font-semibold">You haven't applied to any jobs yet.</div>
                                        <Link to="/browse" className="mt-2 inline-block bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition">Browse Jobs</Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob, idx) => {
                            const isLast = idx === allAppliedJobs.length - 1;
                            if (appliedJob.type === 'internal') {
                                // Show pending/rejected/accepted for internal jobs
                                let color = 'bg-gray-200 text-gray-700';
                                let icon = <Clock className="w-4 h-4 mr-1" />;
                                let label = 'Pending';
                                if (appliedJob.status === 'rejected') {
                                    color = 'bg-red-100 text-red-700';
                                    icon = <XCircle className="w-4 h-4 mr-1" />;
                                    label = 'Rejected';
                                }
                                if (appliedJob.status === 'accepted') {
                                    color = 'bg-green-100 text-green-700';
                                    icon = <CheckCircle className="w-4 h-4 mr-1" />;
                                    label = 'Accepted';
                                }
                                return (
                                    <TableRow key={appliedJob._id} className={`group cursor-pointer ${!isLast ? 'border-b border-gray-100' : ''} transition hover:bg-blue-50/60`}>
                                        <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                        <TableCell className="font-medium text-gray-900 group-hover:underline flex items-center gap-2 max-w-[180px] truncate">
                                            <img src={appliedJob.job?.company?.logo || fallbackLogo} alt="logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0" />
                                            <Link to={`/description/${appliedJob.job?._id}`} className="hover:text-blue-700 transition-colors truncate" aria-label={`View details for ${appliedJob.job?.title}`}>{appliedJob.job?.title}</Link>
                                        </TableCell>
                                        <TableCell className="text-gray-700 max-w-[120px] truncate">{appliedJob.job?.company?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="relative group">
                                                <Badge className={`rounded-full px-4 py-1 text-base font-semibold flex items-center gap-1 ${color}`}>{icon}{label}</Badge>
                                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                                                    {label} (Internal application)
                                                </span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/description/${appliedJob.job?._id}`} className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition text-xs" aria-label={`View job ${appliedJob.job?.title}`}>View</Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            } else if (appliedJob.type === 'external') {
                                // Show 'Externally applied' for external jobs
                                return (
                                    <TableRow key={appliedJob.job?._id || appliedJob._id} className={`group cursor-pointer ${!isLast ? 'border-b border-gray-100' : ''} transition hover:bg-blue-50/60`}>
                                        <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                        <TableCell className="font-medium text-gray-900 group-hover:underline flex items-center gap-2 max-w-[180px] truncate">
                                            <img src={appliedJob.job?.company?.logo || fallbackLogo} alt="logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0" />
                                            <Link to={`/description/${appliedJob.job?._id}`} className="hover:text-blue-700 transition-colors truncate" aria-label={`View details for ${appliedJob.job?.title}`}>{appliedJob.job?.title}</Link>
                                        </TableCell>
                                        <TableCell className="text-gray-700 max-w-[120px] truncate">{appliedJob.job?.company?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="relative group">
                                                <Badge className="rounded-full px-4 py-1 text-base font-semibold flex items-center gap-1 bg-blue-100 text-blue-700"><Globe2 className="w-4 h-4 mr-1" />Externally applied</Badge>
                                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                                                    Marked as applied externally
                                                </span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/description/${appliedJob.job?._id}`} className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition text-xs" aria-label={`View job ${appliedJob.job?.title}`}>View</Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable