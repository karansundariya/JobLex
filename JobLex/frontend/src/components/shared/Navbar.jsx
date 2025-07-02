import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Home as HomeIcon, Briefcase, Compass, Building2, CheckCircle2, Bell } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50'>
            <div className='flex flex-col sm:flex-row items-center justify-between mx-auto max-w-7xl h-auto sm:h-20 px-2 sm:px-4'>
                <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0'>
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-2">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M13 2.05V4.05M13 20.05V22.05M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2.05 13H4.05M20.05 13H22.05M4.93 21.07L6.34 19.66M17.66 6.34L19.07 4.93" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V12L14.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <h1 className='text-3xl font-extrabold tracking-tight text-blue-600'>JobLex</h1>
                </div>
                <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-16 w-full sm:w-auto'>
                    <ul className='flex flex-col sm:flex-row font-semibold items-center gap-2 sm:gap-8 text-lg w-full sm:w-auto'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link to="/admin/companies" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <Building2 size={28} strokeWidth={2.5} className="text-slate-600" />
                                            <span className="text-xl">Companies</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/jobs" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <Briefcase size={28} strokeWidth={2.5} className="text-teal-600" />
                                            <span className="text-xl">Jobs</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <HomeIcon size={28} strokeWidth={2.5} className="text-slate-600" />
                                            <span className="text-xl">Home</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/jobs" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <Briefcase size={28} strokeWidth={2.5} className="text-teal-600" />
                                            <span className="text-xl">Jobs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/browse" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <Compass size={28} strokeWidth={2.5} className="text-amber-600" />
                                            <span className="text-xl">Browse</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/applied-jobs" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <CheckCircle2 size={28} strokeWidth={2.5} className="text-green-600" />
                                            <span className="text-xl">Applied Jobs</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/job-alerts" className="flex items-center gap-2 hover:text-blue-600 transition">
                                            <Bell size={28} strokeWidth={2.5} className="text-yellow-500" />
                                            <span className="text-xl">Job Alerts</span>
                                        </Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline" className="border-blue-600 text-blue-600 rounded-full px-6 py-2 text-lg">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-lg font-semibold">Sign up</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@joblex" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@joblex" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar