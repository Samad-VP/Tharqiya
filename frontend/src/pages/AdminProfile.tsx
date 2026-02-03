import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, ArrowLeft, Loader2, Camera, Trash2, ShieldCheck, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminProfile: React.FC = () => {
    const { user, loading: authLoading, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        whatsapp: '',
        profileImageUrl: '',
        profileImagePublicId: '',
    });

    useEffect(() => {
        if (user && !authLoading) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                whatsapp: user.whatsapp || '',
                profileImageUrl: user.profileImageUrl || '',
                profileImagePublicId: user.profileImagePublicId || '',
            });
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
            toast.error('Please upload a valid image (JPG, PNG, WebP)');
            return;
        }

        if (file.size > 500 * 1024) {
            toast.error('Profile photo must be less than 500KB');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        
        if (formData.profileImagePublicId) {
            data.append('oldPublicId', formData.profileImagePublicId);
        }

        try {
            const response = await api.post('/uploads/profile', data);
            const { url, public_id } = response.data.data;

            setFormData(prev => ({ ...prev, profileImageUrl: url, profileImagePublicId: public_id }));
            
            // Auto-save to profile
            await api.put('/auth/profile', { profileImageUrl: url, profileImagePublicId: public_id });
            updateUser({ profileImageUrl: url, profileImagePublicId: public_id });
            
            toast.success('Profile photo updated successfully');
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = async () => {
        if (!formData.profileImagePublicId) return;
        
        try {
            setUploading(true);
            await api.put('/auth/profile', { profileImageUrl: '', profileImagePublicId: '' });
            setFormData(prev => ({ ...prev, profileImageUrl: '', profileImagePublicId: '' }));
            updateUser({ profileImageUrl: '', profileImagePublicId: '' });
            toast.success('Profile photo removed');
        } catch (error) {
            toast.error('Failed to remove photo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/auth/profile', formData);
            updateUser(formData);
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
                <Loader2 className="w-12 h-12 text-edu-teal animate-spin mb-4" />
                <p className="text-slate-500 font-black tracking-widest uppercase text-[10px]">Processing Admin Credentials...</p>
            </div>
        );
    }

    const backLink = user?.role === 'PRINCIPAL' ? '/principal' : '/admin';

    return (
        <div className="min-h-screen bg-brand-cream dark:bg-slate-950 pt-10 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-4xl mx-auto space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                    <div className="space-y-4">
                        <Link to={backLink} className="inline-flex items-center gap-2 text-slate-500 hover:text-edu-teal transition-colors font-black uppercase text-[10px] tracking-widest">
                            <ArrowLeft size={16} /> Dashboard
                        </Link>
                        <h1 className="text-4xl sm:text-5xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter uppercase leading-none">
                            Admin <span className="text-edu-teal">Identity</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Profile & Security</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Identity Visualization */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-edu-teal/5 blur-3xl rounded-full" />
                        <div className="flex flex-col items-center sm:flex-row gap-8 sm:gap-12 text-center sm:text-left">
                            <div className="relative group/photo">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="w-32 h-32 sm:w-44 sm:h-44 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center relative ring-8 ring-slate-50/50 dark:ring-slate-800/20"
                                >
                                    {formData.profileImageUrl ? (
                                        <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                                            <User size={48} />
                                            <span className="text-[8px] font-black uppercase tracking-widest mt-2">{user?.role}</span>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-tharqiya-deep/70 backdrop-blur-[4px] flex flex-col items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all duration-500 cursor-pointer">
                                        <Camera size={28} className="text-white mb-2 scale-75 group-hover/photo:scale-100 transition-transform" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Photo</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                </motion.div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-edu-teal animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow space-y-4">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <h3 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">{user?.name}</h3>
                                    <div className="px-3 py-1 bg-edu-teal/10 text-edu-teal text-[8px] font-black uppercase tracking-[0.2em] rounded-full border border-edu-teal/20">
                                        Verified {user?.role}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">Manage your administrative identity and profile imagery for official institutional activities.</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                                    <button type="button" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()} className="px-6 py-3 bg-tharqiya-deep dark:bg-white text-white dark:text-tharqiya-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-edu-teal hover:text-white transition-all shadow-lg">Change Photo</button>
                                    {formData.profileImageUrl && (
                                        <button type="button" onClick={removeFile} className="px-6 py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">Remove</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Account Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl space-y-10"
                    >
                        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                            <div className="p-4 bg-edu-teal/10 text-edu-teal rounded-2xl">
                                <Fingerprint size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">Core Information</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Identification</p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Immutable)</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                    <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        disabled 
                                        className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest text-xs cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 0000 0000 00"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                    <input 
                                        type="tel" 
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        placeholder="+91 0000 0000 00"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-edu-teal/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={saving}
                                className="flex items-center gap-3 px-12 py-5 bg-edu-teal text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-edu-teal/25 hover:bg-tharqiya-deep transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Applying Changes...' : 'Save Registry'}
                            </motion.button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
