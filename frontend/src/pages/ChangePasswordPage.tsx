import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Lock, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/auth/password', { currentPassword, newPassword });
            
            toast.success('Password updated successfully! Please login again.');
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to update password';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream dark:bg-slate-950 px-4 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="h-16 w-auto mb-6">
                        <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
                    </div>
                    <h2 className="text-3xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter mb-2">Security Update</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please change your temporary password to continue to your portal.</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-3 rounded-2xl mb-8 text-sm font-bold flex gap-3 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showCurrentPass ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-tharqiya-gold/10 dark:text-white"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-edu-coral dark:hover:text-edu-teal transition-colors"
                            >
                                {showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showNewPass ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-tharqiya-gold/10 dark:text-white"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-edu-coral dark:hover:text-edu-teal transition-colors"
                            >
                                {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-tharqiya-gold/10 dark:text-white"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-edu-coral dark:hover:text-edu-teal transition-colors"
                            >
                                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-lg !rounded-2xl"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Update Password <ArrowRight size={20}/></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePasswordPage;
