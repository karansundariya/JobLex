import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [stats, setStats] = useState({ totalUsers: 0 });
  useEffect(() => {
    fetch('http://localhost:3000/api/v1/user/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);
  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-t-3xl shadow-inner border-t border-t-blue-100 pt-0 pb-10 mt-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full" style={{lineHeight:0}}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path fill="url(#footerwave)" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,53.3C672,43,768,21,864,16C960,11,1056,21,1152,32C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          <defs>
            <linearGradient id="footerwave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="container mx-auto px-2 sm:px-4 pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-0">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <div className="flex items-center justify-center gap-4 my-2 text-gray-600 text-sm">
              <span>🎉 <b>{stats.totalUsers}</b> users joined</span>
            </div>
            <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M13 2.05V4.05M13 20.05V22.05M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2.05 13H4.05M20.05 13H22.05M4.93 21.07L6.34 19.66M17.66 6.34L19.07 4.93" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V12L14.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              JobLex
            </h2>
            <p className="text-sm text-blue-900">© 2025 JobLex. All rights reserved.</p>
            <p className="text-xs text-blue-600 mt-1">Empowering your career journey.</p>
            <p className="text-xs text-blue-500 mt-2 italic">Find your dream job, faster.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <a href="https://www.linkedin.com/in/karan-sundariya/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group hover:bg-blue-100 px-3 py-1 rounded-lg transition">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M13 2.05V4.05M13 20.05V22.05M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2.05 13H4.05M20.05 13H22.05M4.93 21.07L6.34 19.66M17.66 6.34L19.07 4.93" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V12L14.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-blue-700 font-semibold group-hover:underline">Know the Founder</span>
            </a>
            <div className="flex flex-row justify-center sm:justify-end space-x-4 mt-2">
              <a href="https://facebook.com" className="hover:text-blue-600 hover:drop-shadow-glow" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg>
              </a>
              <a href="https://twitter.com" className="hover:text-blue-600 hover:drop-shadow-glow" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" /></svg>
              </a>
              <a href="https://linkedin.com" className="hover:text-blue-600 hover:drop-shadow-glow" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`.hover\\:drop-shadow-glow:hover { filter: drop-shadow(0 0 8px #60a5fa); }`}</style>
    </footer>
  );
}

export default Footer;