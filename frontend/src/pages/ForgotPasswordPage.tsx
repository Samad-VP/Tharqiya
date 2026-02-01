import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('If an account exists, an OTP has been sent to your email.');
            setStep('RESET');
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            toast.success('Password reset successfully! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream dark:bg-slate-950 px-4 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative"
            >
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="h-16 w-auto mb-6">
                        <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter mb-2">
                        {step === 'REQUEST' ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        {step === 'REQUEST' 
                            ? 'Enter your email to receive a One-Time Password.' 
                            : `Enter the OTP sent to ${email} and your new password.`}
                    </p>
                </div>

                {step === 'REQUEST' ? (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-edu-coral dark:group-focus-within:text-edu-teal transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-gold/10 outline-none dark:text-white"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-3 !rounded-2xl"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={18} /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Enter OTP</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-gold/10 outline-none tracking-[0.5em] font-bold text-center text-lg dark:text-white"
                                    placeholder="______"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-gold/10 outline-none dark:text-white"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-edu-coral dark:hover:text-edu-teal transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep('REQUEST')}
                                className="px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 !rounded-2xl"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="mt-8 text-center">
                    <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
