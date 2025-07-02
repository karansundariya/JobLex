import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const stepsStudent = [
  { icon: '📝', title: 'Sign Up / Log In', desc: 'Create your JobLex account or log in.' },
  { icon: '👤', title: 'Complete Profile', desc: 'Fill in your details and upload your resume.' },
  { icon: '🔍', title: 'Search & Save Jobs', desc: 'Browse jobs, use smart filters, and save favorites.' },
  { icon: '🚀', title: 'Apply (Internal/External)', desc: 'Apply directly or mark as applied on company sites.' },
  { icon: '📊', title: 'Track Applications', desc: 'See all your applications and statuses in one place.' },
];

const stepsRecruiter = [
  { icon: '📝', title: 'Sign Up / Log In', desc: 'Register as a recruiter or log in.' },
  { icon: '🏢', title: 'Complete Company Profile', desc: 'Add your company details and logo.' },
  { icon: '📄', title: 'Post Jobs', desc: 'Create job listings with all relevant info.' },
  { icon: '👀', title: 'View Applicants', desc: 'See who applied and manage applications.' },
  { icon: '✅', title: 'Hire & Update Status', desc: 'Mark candidates as hired or update their status.' },
];

function Stepper({ steps }) {
  return (
    <ol className="relative border-l-2 border-blue-200 ml-4">
      {steps.map((step, idx) => (
        <li key={idx} className="mb-10 ml-6">
          <span className="flex absolute -left-6 justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full ring-4 ring-white text-2xl">
            {step.icon}
          </span>
          <h4 className="font-semibold text-lg text-blue-900 mb-1 mt-1">{step.title}</h4>
          <p className="text-blue-700 text-sm">{step.desc}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowWeWork() {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const handleStart = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-2">How JobLex Works</h2>
      <p className="text-center text-blue-700 mb-10 text-lg">Whether you're a student or a recruiter, JobLex makes your journey simple, fast, and transparent.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Student Flow */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-6 text-blue-700 text-center">For Students & Job Seekers</h3>
          <Stepper steps={stepsStudent} />
        </div>
        {/* Recruiter Flow */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h3 className="text-xl font-semibold mb-6 text-green-700 text-center">For Recruiters & Companies</h3>
          <Stepper steps={stepsRecruiter} />
        </div>
      </div>
      <div className="flex flex-col items-center mt-12">
        <p className="text-lg font-medium text-blue-800 mb-4">Ready to get started?</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleStart}>Start as Student</button>
          <button className="bg-green-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-700 transition" onClick={handleStart}>Start as Recruiter</button>
        </div>
      </div>
    </div>
  );
} 