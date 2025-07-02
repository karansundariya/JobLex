import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Lock, User2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex flex-1 items-center justify-center px-2 sm:px-4">
                <form onSubmit={submitHandler} className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-2xl p-10 my-12 flex flex-col items-center space-y-7">
                    <h1 className="font-bold text-3xl mb-2 text-blue-700">Login</h1>
                    <div className="w-full flex flex-col space-y-5">
                        <div>
                            <Label className="text-base">Email <span className="text-red-500">*</span></Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="karan@gmail.com"
                                className="mt-2 text-base px-4 py-2"
                            />
                        </div>
                        <div>
                            <Label className="text-base">Password <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Your password"
                                    className="mt-2 text-base px-4 py-2 pr-10"
                                />
                                <button type="button" className="absolute right-2 top-3 text-blue-400" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-t border-blue-100 my-2"></div>
                    <div className="w-full flex flex-col space-y-5">
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1" className="text-base">Student <span className="text-red-500">*</span></Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2" className="text-base">Recruiter <span className="text-red-500">*</span></Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg py-3">Login</Button>
                    }
                    <span className="text-sm mt-2">Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold">Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login