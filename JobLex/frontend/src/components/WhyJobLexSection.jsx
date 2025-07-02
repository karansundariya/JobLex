import React from 'react';
import { MousePointerClick, Bell, ListChecks, Building2, UserCheck, ShieldCheck, Clock, Globe2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center">
        <MousePointerClick className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'One-click Apply',
    desc: 'Apply to jobs instantly with your complete profile.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <Bell className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Personalized Job Alerts',
    desc: 'Get notified when new jobs match your interests and skills.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-400 rounded-full flex items-center justify-center">
        <UserCheck className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Profile Completion Enforcement',
    desc: "You can't apply until your profile is ready—never miss out due to missing info."
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <ShieldCheck className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Internal & External Applications',
    desc: 'Apply directly or mark as applied on company sites—track both in one place.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
        <ListChecks className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Application & Status Tracking',
    desc: 'Track every job you apply to—internal or external—in one place.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
        <Clock className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Automatic Job Expiry',
    desc: 'Expired jobs are auto-removed, so you only see active opportunities.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
        <Globe2 className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Modern, Mobile-First UI',
    desc: 'Beautiful, responsive design for every device.'
  },
  {
    icon: (
      <span className="inline-block w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full flex items-center justify-center">
        <Building2 className="w-6 h-6 text-white" />
      </span>
    ),
    title: 'Admin Company Management',
    desc: 'Admins can add companies with logos—logos always have a fallback.'
  }
];

const WhyJobLexSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-5xl mx-auto my-10 px-2">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Why <span className="text-blue-600">JobLex</span>?</h2>
        <button
          className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-xl text-base font-semibold shadow-lg hover:scale-105 transition"
          onClick={() => navigate('/how-we-work')}
        >
          See How We Work
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-7 border border-blue-100 text-center transition hover:scale-105 hover:shadow-2xl">
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mt-1 mb-1 text-blue-900">{f.title}</h3>
            <p className="text-blue-700 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyJobLexSection; 