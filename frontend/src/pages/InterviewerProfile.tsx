import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, ArrowLeft, Star, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const InterviewerProfile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        speciality: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/interviews/me');
                const interviewer = response.data.data;
                
                if (interviewer) {
                    setFormData({
                        name: interviewer.user?.name || user?.name || '',
                        phone: interviewer.user?.phone || user?.phone || '',
                        speciality: interviewer.speciality || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        if (user && !authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/interviews/me', formData);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/interviewer" className="inline-flex items-center gap-2 text-slate-500 hover:text-tharqiya-orange transition-colors font-bold uppercase text-xs tracking-widest mb-4">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter">Interviewer <span className="text-tharqiya-orange">Profile</span></h1>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-8"
                    >
                        {/* Profile Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                    <User size={24} />
                                </div>
                                <h2 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit">Personal Details</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email (Read-Only)</label>
                                    <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        disabled 
                                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Specialization</label>
                                    <input 
                                        type="text" 
                                        name="speciality"
                                        value={formData.speciality}
                                        onChange={handleChange}
                                        placeholder="e.g. Hifz, Fiqh, Tajweed"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-4 bg-tharqiya-deep dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {saving ? 'saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default InterviewerProfile;
