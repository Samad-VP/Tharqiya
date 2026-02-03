import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import campus from '../assets/campus.jpg';
import SEO from '../components/SEO';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
            if (user.isFirstLogin) {
                navigate('/change-password');
                return;
            }
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                navigate('/admin');
            } else if (user.role === 'INTERVIEWER') {
                navigate('/interviewer');
            } else if (user.role === 'PRINCIPAL') {
                navigate('/principal');
            } else {
                navigate('/student/portal');
            }
        } catch (err: any) {
            const msg = err.message || 'Invalid credentials. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500 bg-cover bg-center" style={{ backgroundImage: `url(${campus})` }}>
            <SEO 
                title="Login | Access Your Portal" 
                description="Securely access the Darussalam Edu Village portal for students, interviewers, and administrators." 
            />
            {/* Theme-aware Overlay */}
            <div className="absolute inset-0 bg-brand-cream/80 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-500" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="h-20 w-auto flex items-center justify-center mb-6 p-2">
                        <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter">Welcome Back</h2>
                    </motion.div>
                </div>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl mb-8 text-sm font-bold flex gap-3 items-center"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email or Username</label>
                        <div className="relative group">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-edu-coral dark:group-focus-within:text-edu-teal transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 dark:focus:ring-tharqiya-gold/10 focus:border-tharqiya-orange dark:focus:border-tharqiya-gold transition-all outline-none font-medium dark:text-white"
                                placeholder="Email or Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-edu-coral dark:group-focus-within:text-edu-teal transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-orange/10 dark:focus:ring-tharqiya-gold/10 focus:border-tharqiya-orange dark:focus:border-tharqiya-gold transition-all outline-none font-medium dark:text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    <div className="flex justify-end pt-2">
                         <span onClick={() => navigate('/forgot-password')} className="text-xs font-bold text-edu-coral dark:text-edu-teal hover:underline cursor-pointer tracking-wider">Forgot Password?</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-lg !rounded-2xl"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                            <>
                                <span>Login</span>
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                         New student? <span className="text-edu-coral dark:text-edu-teal font-black cursor-pointer hover:underline uppercase tracking-tighter" onClick={() => navigate('/admission')}>Start Application</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
