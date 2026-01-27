import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import AdminLayout from '../components/AdminLayout';
import InterviewerLayout from '../components/InterviewerLayout';

const SettingsPage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    
    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });

    React.useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Password State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Evaluation Standards State (Admin Only)
    const [standards, setStandards] = useState({
        PASS_MARK_HIFZ: '70',
        PASS_MARK_ENGLISH: '50',
        PASS_MARK_GENERAL: '50'
    });
    const [standardsLoading, setStandardsLoading] = useState(false);
    const [standardsStatus, setStandardsStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data.status === 'success') {
                    const s = response.data.data;
                    setStandards({
                        PASS_MARK_HIFZ: s.PASS_MARK_HIFZ || '70',
                        PASS_MARK_ENGLISH: s.PASS_MARK_ENGLISH || '50',
                        PASS_MARK_GENERAL: s.PASS_MARK_GENERAL || '50'
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        if (!authLoading && user) {
            fetchSettings();
        }
    }, [authLoading, user]);

    const handleStandardsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setStandardsLoading(true);
            setStandardsStatus(null);
            await api.post('/settings', {
                settings: standards
            });
            setStandardsStatus({ type: 'success', msg: 'Evaluation standards updated professionally!' });
        } catch (error: any) {
            setStandardsStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to update standards' });
        } finally {
            setStandardsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProfileLoading(true);
            setProfileStatus(null);
            const response = await api.put('/auth/profile', profileData);
            // Update local storage user data
            const storedUser = localStorage.getItem('edu_village_user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const updatedUser = { ...userData, ...response.data.data };
                localStorage.setItem('edu_village_user', JSON.stringify(updatedUser));
            }
            setProfileStatus({ type: 'success', msg: 'Profile updated successfully!' });
        } catch (error: any) {
            setProfileStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setPassStatus({ type: 'error', msg: 'Passwords do not match' });
        }

        try {
            setPassLoading(true);
            setPassStatus(null);
            await api.put('/auth/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setPassStatus({ type: 'success', msg: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setPassStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setPassLoading(false);
        }
    };

    const SettingsContent = (
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                    Account <span className="text-edu-teal">Settings</span>
                </h2>
                <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Manage your institutional credentials and profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
                {/* Profile Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                >
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-edu-teal/10 text-edu-teal">
                            <User size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-brand-deep dark:text-white font-outfit">Personal Details</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                        {profileStatus && (
                            <div className={`p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold ${profileStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                                {profileStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {profileStatus.msg}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text"
                                    value={profileData.name}
                                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full pl-11 pr-6 py-3.5 sm:py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm text-brand-deep dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="email"
                                    value={profileData.email}
                                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full pl-11 pr-6 py-3.5 sm:py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm text-brand-deep dark:text-white"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={profileLoading}
                            className="w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-brand-deep dark:bg-edu-teal text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {profileLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </motion.div>

                {/* Password Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                >
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-edu-coral/10 text-edu-coral">
                            <Lock size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-brand-deep dark:text-white font-outfit">Security</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4 sm:space-y-6">
                        {passStatus && (
                            <div className={`p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold ${passStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                                {passStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {passStatus.msg}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                            <input 
                                type="password"
                                required
                                value={passwords.currentPassword}
                                onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-coral focus:ring-4 focus:ring-edu-coral/10 transition-all font-bold text-xs sm:text-sm text-brand-deep dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-coral focus:ring-4 focus:ring-edu-coral/10 transition-all font-bold text-xs sm:text-sm text-brand-deep dark:text-white"
                                    placeholder="Min. 8 chars"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-deep dark:hover:text-white"
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                            <input 
                                type="password"
                                required
                                value={passwords.confirmPassword}
                                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-coral focus:ring-4 focus:ring-edu-coral/10 transition-all font-bold text-xs sm:text-sm text-brand-deep dark:text-white"
                                placeholder="Repeat password"
                            />
                        </div>

                        <button 
                            disabled={passLoading}
                            className="w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-edu-coral text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-coral/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {passLoading ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Evaluation Standards (Admin Only) */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl mt-8 sm:mt-12"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-edu-teal/10 text-edu-teal">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tight">Academic <span className="text-edu-teal">Standards</span></h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Set passing thresholds for evaluation subjects</p>
                        </div>
                    </div>

                    <form onSubmit={handleStandardsUpdate} className="space-y-8">
                        {standardsStatus && (
                            <div className={`p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold ${standardsStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                                {standardsStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {standardsStatus.msg}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-edu-teal transition-all">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hifz Standard</span>
                                <div className="relative w-full">
                                    <input 
                                        type="number"
                                        value={standards.PASS_MARK_HIFZ}
                                        onChange={e => setStandards({...standards, PASS_MARK_HIFZ: e.target.value})}
                                        className="w-full text-center py-4 bg-white dark:bg-slate-900 rounded-xl font-black text-2xl text-edu-teal outline-none border-2 border-transparent focus:border-edu-teal shadow-inner"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-edu-coral transition-all">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">English Standard</span>
                                <div className="relative w-full">
                                    <input 
                                        type="number"
                                        value={standards.PASS_MARK_ENGLISH}
                                        onChange={e => setStandards({...standards, PASS_MARK_ENGLISH: e.target.value})}
                                        className="w-full text-center py-4 bg-white dark:bg-slate-900 rounded-xl font-black text-2xl text-edu-coral outline-none border-2 border-transparent focus:border-edu-coral shadow-inner"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-brand-deep transition-all">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">General Standard</span>
                                <div className="relative w-full">
                                    <input 
                                        type="number"
                                        value={standards.PASS_MARK_GENERAL}
                                        onChange={e => setStandards({...standards, PASS_MARK_GENERAL: e.target.value})}
                                        className="w-full text-center py-4 bg-white dark:bg-slate-900 rounded-xl font-black text-2xl text-brand-deep dark:text-white outline-none border-2 border-transparent focus:border-brand-deep shadow-inner"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={standardsLoading}
                            className="w-full py-5 rounded-2xl bg-edu-teal text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-teal/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {standardsLoading ? 'Deploying Standards...' : 'Publish Academic Standards'}
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );

    if (user?.role === 'INTERVIEWER') {
        return <InterviewerLayout>{SettingsContent}</InterviewerLayout>;
    }

    return <AdminLayout>{SettingsContent}</AdminLayout>;
};

export default SettingsPage;
