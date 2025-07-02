import React from 'react';
import { Briefcase, Globe, Laptop, User, Building2, Rocket, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'IT & Software', icon: <Laptop className="w-5 h-5" />, filter: 'IT' },
  { label: 'Remote', icon: <Globe className="w-5 h-5" />, filter: 'Remote' },
  { label: 'Fresher', icon: <Rocket className="w-5 h-5" />, filter: 'Fresher' },
  { label: 'Sales', icon: <Users className="w-5 h-5" />, filter: 'Sales' },
  { label: 'HR', icon: <User className="w-5 h-5" />, filter: 'HR' },
  { label: 'Finance', icon: <Building2 className="w-5 h-5" />, filter: 'Finance' },
  { label: 'Marketing', icon: <Briefcase className="w-5 h-5" />, filter: 'Marketing' },
];

const CategoryQuickLinks = () => {
  // const navigate = useNavigate();
  // const handleClick = (cat) => {
  //   if (cat.label === 'Marketing') {
  //     navigate(`/browse?industry=${encodeURIComponent(cat.filter)}`);
  //   }
  // };
  return (
    <div className="w-full max-w-5xl mx-auto mt-6 mb-2 px-2">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.label}
            // onClick={() => handleClick(cat)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold shadow-sm transition border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-default"
            // disabled={idx < 6}
            // title={idx < 6 ? 'For display only' : cat.label}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuickLinks; 