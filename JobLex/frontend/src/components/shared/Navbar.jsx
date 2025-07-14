import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Home as HomeIcon, Briefcase, Compass, Building2, CheckCircle2, Bell, Menu, X } from 'lucide-react'
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Helper function to get user initials
    const getUserInitials = (fullname) => {
        if (!fullname) return 'U';
        return fullname
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const navigationItems = user && user.role === 'recruiter' ? [
        {
            to: "/admin/companies",
            icon: <Building2 size={24} strokeWidth={2.5} className="text-slate-600" />,
            label: "Companies"
        },
        {
            to: "/admin/jobs",
            icon: <Briefcase size={24} strokeWidth={2.5} className="text-teal-600" />,
            label: "Jobs"
        }
    ] : [
        {
            to: "/",
            icon: <HomeIcon size={24} strokeWidth={2.5} className="text-slate-600" />,
            label: "Home"
        },
        {
            to: "/jobs",
            icon: <Briefcase size={24} strokeWidth={2.5} className="text-teal-600" />,
            label: "Jobs"
        },
        {
            to: "/browse",
            icon: <Compass size={24} strokeWidth={2.5} className="text-amber-600" />,
            label: "Browse"
        },
        {
            to: "/applied-jobs",
            icon: <CheckCircle2 size={24} strokeWidth={2.5} className="text-green-600" />,
            label: "Applied Jobs"
        },
        {
            to: "/job-alerts",
            icon: <Bell size={24} strokeWidth={2.5} className="text-yellow-500" />,
            label: "Job Alerts"
        }
    ];

    return (
        <div className='bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <div className='flex items-center gap-2 sm:gap-3'>
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-2">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M13 2.05V4.05M13 20.05V22.05M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2.05 13H4.05M20.05 13H22.05M4.93 21.07L6.34 19.66M17.66 6.34L19.07 4.93" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V12L14.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600'>JobLex</h1>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8'>
                    <ul className='flex font-semibold items-center gap-8 text-lg'>
                        {navigationItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.to} className="flex items-center gap-2 hover:text-blue-600 transition">
                                    {item.icon}
                                    <span className="text-xl">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Desktop Auth Buttons */}
                <div className='hidden md:flex items-center gap-3'>
                    {!user ? (
                        <>
                            <Link to="/login">
                                <Button variant="outline" className="border-blue-600 text-blue-600 rounded-full px-6 py-2 text-lg">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-lg font-semibold">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage 
                                        src={user?.profile?.profilePhoto} 
                                        alt={`${user?.fullname || 'User'}'s profile photo`}
                                        className="object-contain bg-gray-50"
                                    />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                        {getUserInitials(user?.fullname)}
                                    </AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className=''>
                                    <div className='flex gap-2 space-y-2'>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage 
                                                src={user?.profile?.profilePhoto} 
                                                alt={`${user?.fullname || 'User'}'s profile photo`}
                                                className="object-contain bg-gray-50"
                                            />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                                {getUserInitials(user?.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        {user && user.role === 'student' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                            </div>
                                        )}
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden'>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in fixed inset-0 z-[9999] overflow-y-auto'>
                    <div className='px-4 py-6 space-y-4'>
                        {/* Mobile Navigation Items */}
                        <ul className='space-y-4'>
                            {navigationItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        to={item.to} 
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 p-3 min-w-[44px] min-h-[44px] rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {item.icon}
                                        <span className="text-lg">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className='border-t border-gray-100 my-4'></div>
                        {/* Mobile Auth Buttons */}
                        {!user ? (
                            <div className='flex flex-col gap-3'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-blue-600 text-blue-600 rounded-full px-6 py-3 text-lg w-full min-w-[44px] min-h-[44px]">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-lg font-semibold w-full min-w-[44px] min-h-[44px]">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-3'>
                                    <Avatar className="cursor-pointer w-12 h-12 min-w-[44px] min-h-[44px]">
                                        <AvatarImage 
                                            src={user?.profile?.profilePhoto} 
                                            alt={`${user?.fullname || 'User'}'s profile photo`}
                                            className="object-contain bg-gray-50 w-full h-full rounded-full"
                                        />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold w-full h-full flex items-center justify-center">
                                            {getUserInitials(user?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className='font-medium'>{user?.fullname}</h4>
                                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                    </div>
                                </div>
                                {user && user.role === 'student' && (
                                    <Button variant="link" className="w-full min-w-[44px] min-h-[44px]" onClick={closeMobileMenu}><Link to="/profile">View Profile</Link></Button>
                                )}
                                <Button onClick={() => { logoutHandler(); closeMobileMenu(); }} variant="link" className="w-full min-w-[44px] min-h-[44px]">Logout</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar