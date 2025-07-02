import React, { useEffect, useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import { Button } from './ui/button';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';

const JobAlerts = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  // Job alerts logic improved
  // Fetch latest tracked keywords on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          setKeywords(res.data.user.trackedKeywords || []);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [dispatch, user?._id]);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const res = await axios.post(`${USER_API_END_POINT}/track-keyword`, { keyword: newKeyword.trim() }, { withCredentials: true });
      if (res.data.success) {
        setKeywords(res.data.trackedKeywords);
        setNewKeyword('');
      }
    } catch (error) {
      // Optionally show error
    }
  };

  const handleRemoveKeyword = async (k) => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/untrack-keyword`, { keyword: k }, { withCredentials: true });
      if (res.data.success) {
        setKeywords(res.data.trackedKeywords);
      }
    } catch (error) {
      // Optionally show error
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-2 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-blue-400 flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-blue-700 mb-2">Job Alerts</h1>
            <p className="text-blue-600 mb-6 text-center">Add your interests and we'll email you as soon as a matching job is posted. Login to set up and receive job alerts!</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition mt-4" onClick={() => navigate('/login')}>Login to Get Alerts</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-2 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-blue-400 flex items-center justify-center mb-4">
            <Bell className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700 mb-2">Job Alerts</h1>
          <p className="text-blue-600 mb-6 text-center">Add your interests and we'll email you as soon as a matching job is posted.</p>
          <div className="w-full mb-6 bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100">
            <h2 className="text-base font-semibold text-blue-800 mb-2">Your Job Alerts are based on:</h2>
            {loading ? (
              <div className="text-blue-500 text-sm mt-2">Loading your keywords...</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {keywords.length === 0 ? <span className="text-gray-400">No keywords added.</span> : keywords.map((k) => (
                    <span key={k} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Search className="w-4 h-4" /> {k}
                      <button onClick={() => handleRemoveKeyword(k)} className="ml-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2 w-full max-w-xs">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    placeholder="Add new interest keyword"
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                  />
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm" onClick={handleAddKeyword}>Add</Button>
                </div>
              </>
            )}
          </div>
          <div className="w-full">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">How Job Alerts Work</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3 shadow-sm">
                <Bell className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="font-medium text-blue-900">We'll email you as soon as a new job matching your interests is posted.</div>
                  <div className="text-xs text-blue-500">No spam. Only real, relevant alerts.</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlerts; 