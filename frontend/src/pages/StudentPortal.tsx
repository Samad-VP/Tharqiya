import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Timer, FolderOpen, CheckSquare, ShieldAlert, Sparkles, Download, Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

interface ApplicationData {
    applicationNo: string;
    hifzCenter: string;
    status: string;
    application: {
        appliedAt: string;
    };
}

const StudentPortal: React.FC = () => {
    const { user } = useAuth();
    const [appData, setAppData] = useState<ApplicationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) return;
            try {
                const response = await axios.get('/api/admissions/my-status', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setAppData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [user]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return { icon: <CheckSquare className="w-12 h-12" />, color: 'text-tharqiya-orange', bg: 'bg-tharqiya-orange/10' };
            case 'REJECTED': return { icon: <ShieldAlert className="w-12 h-12" />, color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'PENDING': return { icon: <Timer className="w-12 h-12" />, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            default: return { icon: <FolderOpen className="w-12 h-12" />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-tharqiya-cream dark:bg-slate-950">
            <div className="w-16 h-16 border-4 border-tharqiya-orange border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">Awaiting Scholar Data...</p>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-tharqiya-cream dark:bg-slate-950">
            <div className="text-center">
                <h2 className="text-2xl font-black font-outfit text-tharqiya-deep dark:text-white mb-4 tracking-tight">Unauthorized Session</h2>
                <button className="btn-primary">Return to Login</button>
            </div>
        </div>
    );

    const statusStyle = appData ? getStatusStyles(appData.status) : null;

    return (
        <div className="min-h-screen bg-tharqiya-cream dark:bg-slate-950 pt-32 pb-20 px-4 transition-colors duration-500">

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 rounded-[2.5rem] mb-10 overflow-hidden relative border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-28 h-28 bg-tharqiya-cream rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3 overflow-hidden p-3 border border-slate-100">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                                <Sparkles className="w-5 h-5 text-tharqiya-gold" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter mb-2">
                                Assalam-u-Alaikum, <span className="text-transparent bg-clip-text bg-gradient-to-r from-tharqiya-orange to-tharqiya-gold dark:from-tharqiya-gold dark:to-tharqiya-gold">{user.name.split(' ')[0]}</span>
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-black uppercase tracking-widest">Candidate ID: {user.id.slice(0, 8)}</span>
                                <span className="px-4 py-1.5 bg-tharqiya-orange/10 dark:bg-tharqiya-gold/10 text-tharqiya-orange dark:text-tharqiya-gold rounded-full text-xs font-black uppercase tracking-widest border border-tharqiya-orange/20 dark:border-tharqiya-gold/20">Post-Hifz 2026</span>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <button className="p-4 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl relative hover:text-tharqiya-orange dark:hover:text-tharqiya-gold transition-colors">
                                <Bell size={24} />
                                <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {!appData ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-24 text-center rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FolderOpen className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-black text-tharqiya-deep dark:text-white mb-4 tracking-tight font-outfit">Your Journey Awaits</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium">You haven't initiated your admission process yet. Start your application to become a Tharqawi scholar.</p>
                        <button className="btn-primary px-12 py-5 text-xl">Initiate Application</button>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-tharqiya-orange dark:bg-tharqiya-gold" />
                                <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white mb-8 font-outfit tracking-tight">Application Dossier</h3>
                                <div className="grid gap-6">
                                    {[
                                        { label: 'Application Number', value: appData.applicationNo, highlight: true },
                                        { label: 'Base Hifz Institution', value: appData.hifzCenter },
                                        { label: 'Submission Timestamp', value: new Date(appData.application.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                        { label: 'Document Verification', value: 'Completed', success: true }
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{row.label}</span>
                                            <span className={`font-bold text-lg ${row.highlight ? 'text-tharqiya-orange dark:text-tharqiya-gold' : row.success ? 'text-tharqiya-orange' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[2.5rem] text-center border border-slate-100 dark:border-slate-800 relative group">
                                <div className={`w-28 h-28 ${statusStyle?.bg} ${statusStyle?.color} rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                                    {statusStyle?.icon}
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">Current Mileststone</span>
                                <h3 className={`text-3xl font-black font-outfit tracking-tighter ${statusStyle?.color}`}>{appData.status}</h3>
                                <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {appData.status === 'PENDING' ? 'Your sacred application is currently undergoing scholarly review at Muchukunnu Village.' :
                                            appData.status === 'INTERVIEW_SCHEDULED' ? 'You have been selected for the evaluation round. Please monitor your digital channels.' :
                                                'Final evolutionary phase completed. Welcome to Tharqiya.'}
                                    </p>
                                </div>
                            </div>

                            {appData.status === 'ACCEPTED' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full bg-tharqiya-gold dark:bg-tharqiya-gold text-white dark:text-slate-950 py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-tharqiya-gold/30 flex items-center justify-center gap-3 uppercase tracking-widest"
                                >
                                    <Download className="w-6 h-6" />
                                    Download Result
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPortal;
