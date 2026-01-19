import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                navigate('/admin');
            } else if (user.role === 'INTERVIEWER') {
                navigate('/interviewer');
            } else {
                navigate('/portal');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4 relative overflow-hidden transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] islamic-pattern pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-tharqiya-green/10 dark:bg-tharqiya-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-tharqiya-gold/10 dark:bg-tharqiya-green/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl rotate-3 overflow-hidden p-2 border border-slate-100">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Welcome Back</h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Sparkles className="w-4 h-4 text-tharqiya-gold animate-pulse" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Admission Management System</p>
                        </div>
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
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email Connection</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-tharqiya-green dark:group-focus-within:text-tharqiya-gold transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-green/10 dark:focus:ring-tharqiya-gold/10 focus:border-tharqiya-green dark:focus:border-tharqiya-gold transition-all outline-none font-medium dark:text-white"
                                placeholder="name@scholar.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Secured Code</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-tharqiya-green dark:group-focus-within:text-tharqiya-gold transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-tharqiya-green/10 dark:focus:ring-tharqiya-gold/10 focus:border-tharqiya-green dark:focus:border-tharqiya-gold transition-all outline-none font-medium dark:text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <span className="text-xs font-bold text-tharqiya-green dark:text-tharqiya-gold hover:underline cursor-pointer tracking-wider">Forgot Password?</span>
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
                                <span>Access Portal</span>
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        New candidate? <span className="text-tharqiya-green dark:text-tharqiya-gold font-black cursor-pointer hover:underline uppercase tracking-tighter">Initiate Application</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
