import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Clock, 
    CalendarCheck, 
    Trophy,
    ArrowUpRight,
    TrendingUp,
    Shield
} from 'lucide-react';
import InterviewerLayout from '../components/InterviewerLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const InterviewerDashboard: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [standards, setStandards] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data.status === 'success') {
                    setStandards(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        if (!authLoading && currentUser) {
            fetchSettings();
        }
    }, [authLoading, currentUser]);

    const stats = [
        { label: 'Assigned Interviews', value: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Pending Evaluations', value: '5', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Completed Today', value: '3', icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Average Score Given', value: '7.8', icon: Trophy, color: 'text-tharqiya-orange', bg: 'bg-tharqiya-orange/10' },
    ];

    return (
        <InterviewerLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Hero / Welcome */}
                <div className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-tharqiya-orange to-tharqiya-gold overflow-hidden shadow-2xl text-white">
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-outfit tracking-tighter mb-3 sm:mb-4">
                            Welcome Back, <span className="text-tharqiya-deep">Interviewer</span>
                        </h2>
                        <p className="max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed opacity-90">
                            Evaluate candidates, submit marks, and help us select the next generation of scholars for Darussalam Tharqiya College.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit mb-1">{stat.value}</h3>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
                {/* Academic Standards Section */}
                {standards && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-[2.5rem] border border-tharqiya-gold/20 shadow-xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Shield size={120} className="text-tharqiya-gold rotate-12" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <h4 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">Academic <span className="text-tharqiya-gold">Benchmarks</span></h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Institutional passing standards for session 2026</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { label: 'Hifz', value: standards.PASS_MARK_HIFZ, color: 'text-emerald-500' },
                                    { label: 'English', value: standards.PASS_MARK_ENGLISH, color: 'text-blue-500' },
                                    { label: 'GK', value: standards.PASS_MARK_GENERAL, color: 'text-tharqiya-orange' }
                                ].map((bench, i) => (
                                    <div key={i} className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bench.label}</span>
                                        <span className={`text-lg font-black ${bench.color}`}>{bench.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Recent Assignments Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl min-h-[300px] sm:min-h-[400px]">
                        <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight mb-6 sm:mb-8">Pending Evaluations</h4>
                        <div className="space-y-4">
                             {[1, 2, 3].map((_, i) => (
                                 <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-tharqiya-orange/30 transition-all gap-4 text-left">
                                     <div className="flex gap-4 items-center">
                                         <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-tharqiya-orange/10 flex items-center justify-center font-black text-tharqiya-orange text-sm sm:text-base">
                                             S{i+1}
                                         </div>
                                         <div className="overflow-hidden">
                                             <p className="font-black text-tharqiya-deep dark:text-white text-sm sm:text-base truncate">Abdullah Faisal</p>
                                             <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider truncate">ID: #TK928{i}</p>
                                         </div>
                                     </div>
                                     <button className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-tharqiya-orange text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-tharqiya-orange/20">
                                         Evaluate
                                     </button>
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight mb-6 sm:mb-8">Schedule</h4>
                        <div className="space-y-4 sm:space-y-6">
                             {[1, 2, 3, 4].map((_, i) => (
                                 <div key={i} className="flex gap-3 sm:gap-4 items-start pb-4 sm:pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center">
                                         <Clock size={16} className="text-slate-400" />
                                     </div>
                                     <div className="space-y-1">
                                         <p className="text-xs sm:text-sm font-bold text-tharqiya-deep dark:text-white">Interview @ 10:30 AM</p>
                                         <p className="text-[10px] sm:text-xs text-slate-500">Hall A • Today</p>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </InterviewerLayout>
    );
};

export default InterviewerDashboard;
