import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setFilters } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRef = useRef();

    const searchJobHandler = () => {
        navigate(`/browse?search=${encodeURIComponent(query)}`);
        inputRef.current && inputRef.current.blur();
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchJobHandler();
    };

    return (
        <section className="w-full relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-10 border-b border-gray-100 overflow-hidden">
            {/* SVG Wave Illustration - Hidden on mobile for better performance */}
            <svg className="absolute left-0 bottom-0 w-full h-16 sm:h-24 md:h-32 lg:h-40 pointer-events-none hidden sm:block" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="url(#hero-wave)" fillOpacity="1" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,197.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                <defs>
                    <linearGradient id="hero-wave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6A38C2" />
                        <stop offset="100%" stopColor="#4F8AF4" />
                    </linearGradient>
                </defs>
            </svg>
            
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 sm:gap-6 px-4 relative z-10">
                {/* Mobile-optimized heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center leading-tight px-2">
                    Find Your Next Job with <span className="text-blue-600">JobLex</span>
                </h1>
                
                {/* Mobile-optimized description */}
                <p className="text-base sm:text-lg text-gray-600 text-center max-w-xl px-2 leading-relaxed">
                    The modern, simple way to discover, save, and apply to top jobs. Search thousands of opportunities in seconds.
                </p>
                
                {/* Mobile-optimized search bar */}
                <div className="flex w-full max-w-xl mx-auto rounded-2xl border border-blue-200 bg-white shadow-lg items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 focus-within:scale-105">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Search jobs, companies, or skills...'
                        className='outline-none border-none w-full bg-transparent text-base sm:text-lg px-2 py-2 rounded-l-2xl placeholder:text-gray-400 focus:ring-0 focus:outline-none'
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold flex items-center gap-2 shadow-md transition-transform duration-150 active:scale-95 min-h-[44px]"
                    >
                        <Search className='h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-focus-within:scale-110' />
                        <span className="hidden sm:inline">Search</span>
                    </Button>
                </div>
                
                {/* Mobile-optimized quick actions */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 sm:mt-6">
                    <Button 
                        variant="outline" 
                        className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm sm:text-base"
                        onClick={() => navigate('/jobs')}
                    >
                        Browse All Jobs
                    </Button>
                    <Button 
                        variant="outline" 
                        className="rounded-full border-green-200 text-green-600 hover:bg-green-50 px-4 py-2 text-sm sm:text-base"
                        onClick={() => navigate('/browse')}
                    >
                        Explore Companies
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

/* Add these keyframes to your global CSS (index.css):
.animate-gradient {
  background-size: 200% 200%;
  animation: gradientMove 8s ease-in-out infinite;
}
@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-fade-in { animation: fadeIn 1s ease-in; }
.animate-fade-in-slow { animation: fadeIn 2s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
.animate-gradient-text {
  background-size: 200% 200%;
  animation: gradientMove 6s ease-in-out infinite;
}
*/