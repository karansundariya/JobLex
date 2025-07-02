import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber !== undefined && user?.phoneNumber !== null ? String(user.phoneNumber) : "",
        bio: user?.profile?.bio || "",
        skills: Array.isArray(user?.profile?.skills) ? user.profile.skills.join(',') : (user?.profile?.skills || ""),
        file: user?.profile?.resume || "",
        profilePhoto: null
    });
    const dispatch = useDispatch();

    // Always reset input state from Redux user as strings
    useEffect(() => {
        if (open) {
            setInput({
                fullname: user?.fullname || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber !== undefined && user?.phoneNumber !== null ? String(user.phoneNumber) : "",
                bio: user?.profile?.bio || "",
                skills: Array.isArray(user?.profile?.skills) ? user.profile.skills.join(',') : (user?.profile?.skills || ""),
                file: user?.profile?.resume || "",
                profilePhoto: null
            });
        }
    }, [open, user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const photoChangeHandler = (e) => {
        const profilePhoto = e.target.files?.[0];
        setInput({ ...input, profilePhoto })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                // Refetch latest profile from backend for reliability
                const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
                if (profileRes.data.success) {
                    dispatch(setUser(profileRes.data.user));
                    setOpen(false);
                } else {
                    dispatch(setUser(res.data.user)); // fallback
                    setOpen(false);
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[430px] bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900 mb-2">Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-5 py-2'>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="fullname" className="text-right text-gray-700 font-semibold">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={input.email}
                                    disabled
                                    className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
                                    aria-disabled="true"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security and uniqueness reasons.</p>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="phoneNumber" className="text-right text-gray-700 font-semibold">Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={input.phoneNumber !== undefined && input.phoneNumber !== null ? String(input.phoneNumber) : ""}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="bio" className="text-right text-gray-700 font-semibold">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="skills" className="text-right text-gray-700 font-semibold">Skills (comma separated)</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="file" className="text-right text-gray-700 font-semibold">Resume (PDF or Image)</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={fileChangeHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-3'>
                                <Label htmlFor="profilePhoto" className="text-right text-gray-700 font-semibold">Profile Image</Label>
                                <Input
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={photoChangeHandler}
                                    className="col-span-3 rounded-full border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-2"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog