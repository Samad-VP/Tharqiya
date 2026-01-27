import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Save, ArrowLeft, GraduationCap, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const StudentProfile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        dob: '',
        address: '',
        place: '',
        district: '',
        hifzCenter: '',
        fatherName: '',
        motherName: '',
        whatsapp: '',
        phone: '', // User phone
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/admissions/my-status');
                const student = response.data.data;
                
                if (student) {
                    setFormData({
                        dob: student.dob ? (new Date(student.dob).toISOString().split('T')[0] || '') : '',
                        address: student.address || '',
                        place: student.place || '',
                        district: student.district || '',
                        hifzCenter: student.hifzCenter || '',
                        fatherName: student.fatherName || '',
                        motherName: student.motherName || '',
                        whatsapp: student.whatsapp || '',
                        phone: user?.phone || '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/admissions/my-profile', formData);
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
             <div className="min-h-screen flex flex-col items-center justify-center bg-tharqiya-cream dark:bg-slate-950">
                <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tharqiya-cream dark:bg-slate-950 pt-24 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/portal" className="inline-flex items-center gap-2 text-slate-500 hover:text-tharqiya-orange transition-colors font-bold uppercase text-xs tracking-widest mb-4">
                        <ArrowLeft size={16} /> Back to Portal
                    </Link>
                    <h1 className="text-4xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter">My <span className="text-tharqiya-orange">Profile</span></h1>
                    <p className="text-slate-500 font-medium">Manage your personal and academic information</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-8"
                    >
                        {/* Personal Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                    <User size={24} />
                                </div>
                                <h2 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit">Personal Information</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name (Read-Only)</label>
                                    <input 
                                        type="text" 
                                        value={user?.name || ''} 
                                        disabled 
                                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Father's Name</label>
                                    <input 
                                        type="text" 
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mother's Name</label>
                                    <input 
                                        type="text" 
                                        name="motherName"
                                        value={formData.motherName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Contact Information */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                    <Phone size={24} />
                                </div>
                                <h2 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit">Contact Information</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
                                    <input 
                                        type="tel" 
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Permanent Address</label>
                                    <textarea 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Place</label>
                                    <input 
                                        type="text" 
                                        name="place"
                                        value={formData.place}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">District</label>
                                    <input 
                                        type="text" 
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                         <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Academic Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                    <GraduationCap size={24} />
                                </div>
                                <h2 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit">Academic Information</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hifz Center / Institution</label>
                                    <input 
                                        type="text" 
                                        name="hifzCenter"
                                        value={formData.hifzCenter}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-tharqiya-orange focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-4 bg-tharqiya-deep dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
