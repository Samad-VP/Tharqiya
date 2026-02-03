import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Clock, 
    CalendarCheck, 
    Trophy,
    ArrowUpRight,
    TrendingUp,
    Shield,
    Loader2,
    Zap,
    BookMarked,
    Info,
    CalendarCheck as CalendarIcon,
    Briefcase, // Added Briefcase icon
    Settings // Added Settings icon
} from 'lucide-react';
import InterviewerLayout from '../components/InterviewerLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const InterviewerDashboard: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [standards, setStandards] = useState<any>(null);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [settingsRes, interviewsRes] = await Promise.all([
                    api.get('/settings'),
                    api.get('/interviews/assigned')
                ]);
                
                if (settingsRes.data.status === 'success') {
                    setStandards(settingsRes.data.data);
                }
                
                if (interviewsRes.data.status === 'success') {
                    setInterviews(interviewsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
 
        if (!authLoading && currentUser) {
            fetchData();
        }
    }, [authLoading, currentUser]);

    const calculateStats = () => {
        const total = interviews.length;
        const pending = interviews.filter(i => (i.evaluations?.length || 0) < 3).length;
        
        const today = new Date().toISOString().split('T')[0];
        const completedToday = interviews.filter(i => {
            const isToday = new Date(i.scheduledAt).toISOString().split('T')[0] === today;
            const isCompleted = (i.evaluations?.length || 0) >= 3;
            return isToday && isCompleted;
        }).length;

        // Calculate Average Score
        let totalMarks = 0;
        let totalEvaluations = 0;
        interviews.forEach(i => {
            i.evaluations?.forEach((e: any) => {
                totalMarks += e.marks;
                totalEvaluations++;
            });
        });
        const average = totalEvaluations > 0 ? (totalMarks / totalEvaluations).toFixed(1) : '0.0';

        return [
            { label: 'Assigned Interviews', value: total.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Pending Evaluations', value: pending.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Completed Today', value: completedToday.toString(), icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Average Score Given', value: average, icon: Trophy, color: 'text-tharqiya-orange', bg: 'bg-tharqiya-orange/10' },
        ];
    };

    const stats = calculateStats();
    const pendingEvaluations = interviews.filter(i => (i.evaluations?.length || 0) < 3);
    const todayInterviews = interviews.filter(i => {
        const today = new Date().toISOString().split('T')[0];
        return new Date(i.scheduledAt).toISOString().split('T')[0] === today;
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    return (
        <InterviewerLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Hero / Welcome */}
                <div className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter mb-3 sm:mb-4">
                            Welcome Back, <span className="text-tharqiya-deep dark:text-tharqiya-gold">Interviewer</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed opacity-90">
                            Evaluate candidates, submit marks, and help us select the next generation of scholars for Darussalam Tharqiya College.
                        </p>                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-tharqiya-gold/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-tharqiya-orange/20 blur-[100px] rounded-full" />
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
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
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
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Institutional passing standards for session 2026</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { label: 'Hifz', value: standards.PASS_MARK_HIFZ, color: 'text-emerald-500' },
                                    { label: 'English', value: standards.PASS_MARK_ENGLISH, color: 'text-blue-500' },
                                    { label: 'GK', value: standards.PASS_MARK_GENERAL, color: 'text-tharqiya-orange' }
                                ].map((bench, i) => (
                                    <div key={i} className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{bench.label}</span>
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
                             {loading ? (
                                 <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                     <Loader2 className="animate-spin text-tharqiya-orange mb-2" />
                                     <span className="text-[10px] font-black uppercase tracking-widest">Loading Interviews...</span>
                                 </div>
                             ) : pendingEvaluations.length > 0 ? pendingEvaluations.map((interview, i) => (
                                 <div key={interview.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-tharqiya-orange/30 transition-all gap-4 text-left">
                                     <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-tharqiya-orange/10 flex items-center justify-center font-black text-tharqiya-orange text-sm sm:text-base overflow-hidden shrink-0">
                                            {interview.application?.student?.user?.profileImageUrl ? (
                                                <img 
                                                    src={interview.application.student.user.profileImageUrl} 
                                                    alt="Student" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                (interview.application?.student?.user?.name || interview.application?.student?.name)?.[0] || 'S'
                                            )}
                                        </div>
                                         <div className="overflow-hidden">
                                             <p className="font-black text-tharqiya-deep dark:text-white text-sm sm:text-base truncate">
                                                 {interview.application?.student?.user?.name || interview.application?.student?.name}
                                             </p>
                                             <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider truncate">
                                                 {interview.application?.student?.applicationNo} • {new Date(interview.scheduledAt).toLocaleDateString()}
                                             </p>
                                         </div>
                                     </div>
                                     <Link 
                                        to={`/interviewer/evaluate/${interview.id}`}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tharqiya-orange text-white font-black text-center text-[10px] sm:text-xs uppercase tracking-widest hover:bg-tharqiya-deep transition-all shadow-lg shadow-tharqiya-orange/20 flex items-center justify-center gap-2 group"
                                     >
                                         <span>Evaluate</span>
                                         <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                     </Link>
                                 </div>
                             )) : (
                                <div className="py-20 text-center opacity-40">
                                    <Trophy size={48} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">All current evaluations completed!</p>
                                </div>
                             )}
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight mb-6 sm:mb-8">Today's Schedule</h4>
                        <div className="space-y-4 sm:space-y-6">
                             {loading ? (
                                 <div className="py-4 opacity-50 text-center">
                                      <Loader2 className="animate-spin text-slate-400 mx-auto" />
                                 </div>
                             ) : todayInterviews.length > 0 ? todayInterviews.map((interview) => (
                                 <div key={interview.id} className="flex gap-3 sm:gap-4 items-start pb-4 sm:pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center">
                                         <Clock size={16} className="text-slate-400" />
                                     </div>
                                      <div className="space-y-1">
                                          <p className="text-xs sm:text-sm font-bold text-tharqiya-deep dark:text-white">
                                             {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                         </p>
                                         <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                             {interview.application?.student?.user?.name || interview.application?.student?.name} • {interview.location || 'College'}
                                         </p>
                                     </div>
                                 </div>
                             )) : (
                                <div className="py-10 text-center opacity-30">
                                    <CalendarIcon size={32} className="mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No interviews today</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Guidelines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Quick Task Center */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-tharqiya-orange/10 text-tharqiya-orange rounded-2xl">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">Fast <span className="text-tharqiya-orange">Actions</span></h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Assigned Board', path: '/interviewer/interviews', icon: BookMarked, desc: 'View all appointments' },
                                { label: 'My Registry', path: '/interviewer/evaluations', icon: Shield, desc: 'History of evaluation' },
                                { label: 'System Settings', path: '/interviewer/settings', icon: Settings, desc: 'Account configuration' },
                                { label: 'Help Desk', path: '#', icon: Info, desc: 'Technical assistance' },
                            ].map((item, i) => (
                                <Link 
                                    key={i} 
                                    to={item.path}
                                    className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-tharqiya-orange/20 hover:bg-white dark:hover:bg-slate-800 transition-all group relative overflow-hidden"
                                >
                                    <item.icon size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-tharqiya-orange transition-colors mb-4" />
                                    <p className="text-xs font-black text-tharqiya-deep dark:text-white uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{item.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Institutional Guidelines */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 sm:p-10 rounded-[2.5rem] bg-tharqiya-deep text-white shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Info size={140} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tighter">Evaluation <span className="text-tharqiya-gold">Protocols</span></h4>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Darussalam Tharqiya Institutional Standard</p>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: 'Academic Merit', desc: 'Focus on Hifz accuracy and Tajweed mastery as primary criteria.' },
                                    { title: 'Critical Thinking', desc: 'Evaluate General Knowledge through logical reasoning questions.' },
                                    { title: 'Language Proficiency', desc: 'Assess English communication skills for international readiness.' },
                                    { title: 'Scholarly Aptitude', desc: 'Note behavioral observations and potential for higher Islamic studies.' }
                                ].map((guide, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-tharqiya-gold text-tharqiya-deep flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-tharqiya-gold">{guide.title}</p>
                                            <p className="text-[10px] font-medium text-white/70 mt-1 leading-relaxed">{guide.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </InterviewerLayout>
    );
};

export default InterviewerDashboard;
