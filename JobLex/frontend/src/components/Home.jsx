import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CategoryQuickLinks from './CategoryQuickLinks'
import FeaturedCompaniesCarousel from './FeaturedCompaniesCarousel'
import WhyJobLexSection from './WhyJobLexSection'

// Home page main component logic updated
const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div className="px-2 sm:px-4">
      <Navbar />
      <HeroSection />
      <CategoryQuickLinks />
      <FeaturedCompaniesCarousel />
      <WhyJobLexSection />
      <CategoryCarousel />
      <LatestJobs />
      <div className="flex justify-center mt-12 mb-8">
        <button
          className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition"
          onClick={() => navigate('/how-we-work')}
        >
          See How JobLex Works
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default Home