import React from 'react';
import { useNavigate } from 'react-router-dom';

const companies = [
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com' },
  { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com' },
  { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com' },
  { name: 'Flipkart', logo: 'https://logo.clearbit.com/flipkart.com' },
  { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
  { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com' },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
];

const FeaturedCompaniesCarousel = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-5xl mx-auto mt-6 mb-2 px-2">
      <div className="flex gap-6 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
        {companies.map((c) => (
          <button
            key={c.name}
            onClick={() => navigate(`/browse?company=${encodeURIComponent(c.name)}`)}
            className="flex flex-col items-center min-w-[80px] focus:outline-none"
            title={c.name}
          >
            <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm object-contain mb-1" />
            <span className="text-xs text-gray-700 font-semibold truncate w-16 text-center">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCompaniesCarousel; 