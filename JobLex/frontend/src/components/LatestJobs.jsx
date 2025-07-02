import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <section className="relative py-12 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl shadow-lg mx-2 my-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Latest & Top</span> Job Openings
                </h1>
                <p className="text-center text-blue-700 text-lg mb-8">Handpicked opportunities from top companies, updated in real-time.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
                    {
                        allJobs.length <= 0 ? <span className="col-span-full text-center text-gray-500">No Job Available</span> : allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                    }
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
                .animate-fade-in > * { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
            `}</style>
        </section>
    )
}

export default LatestJobs