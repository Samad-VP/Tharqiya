import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Book, 
    Download, 
    Search,
    Trophy,
    Calendar,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import InterviewerLayout from '../components/InterviewerLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const InterviewerEvaluations: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                setLoading(true);
                const response = await api.get('/interviews/assigned');
                if (response.data.status === 'success') {
                    // Filter only those with evaluations
                    const completed = response.data.data.filter((i: any) => i.evaluations?.length > 0);
                    setInterviews(completed);
                }
            } catch (error) {
                console.error('Error fetching evaluations:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && currentUser) {
            fetchEvaluations();
        }
    }, [authLoading, currentUser]);

    const filteredEvaluations = interviews.filter(i => {
        const student = i.application?.student;
        const name = (student?.user?.name || student?.name || '').toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    return (
        <InterviewerLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tighter leading-none">
                            Scholarly <span className="text-tharqiya-gold">Registry</span>
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2 px-1">Evaluation History & Performance Logs</p>
                    </div>

                    <button className="flex items-center gap-3 px-8 py-3 bg-white dark:bg-slate-900 text-tharqiya-deep dark:text-white border border-slate-100 dark:border-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                        <Download size={14} className="group-hover:text-tharqiya-orange transition-colors" /> Export Registry (CSV)
                    </button>
                </div>

                {/* Stats Summary Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Assessed', value: interviews.length, color: 'text-blue-500', icon: Book },
                        { label: 'Avg Grade Assigned', value: '78.5%', color: 'text-tharqiya-orange', icon: Trophy },
                        { label: 'Registry Sessions', value: interviews.length, color: 'text-emerald-500', icon: Calendar },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                            <stat.icon className={`absolute top-0 right-0 p-8 opacity-5 ${stat.color}`} size={120} />
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className={`text-4xl font-black font-outfit ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Filter scholarly logs by student name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-14 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-sm shadow-sm outline-none"
                    />
                </div>

                {/* Registry Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Registry Date</th>
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Scholar / Candidate</th>
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Hifz Score</th>
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">English Score</th>
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">General Score</th>
                                    <th className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] text-right">View Board</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Assessment Logs...</p>
                                        </td>
                                    </tr>
                                ) : filteredEvaluations.length > 0 ? filteredEvaluations.map((item, idx) => {
                                    const hifzMark = item.evaluations.find((e: any) => e.subject === 'Hifz')?.marks || 'N/A';
                                    const englishMark = item.evaluations.find((e: any) => e.subject === 'English')?.marks || 'N/A';
                                    const generalMark = item.evaluations.find((e: any) => e.subject === 'General')?.marks || 'N/A';
                                    
                                    return (
                                        <motion.tr 
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-10 py-8">
                                                <span className="font-bold text-xs text-slate-500 dark:text-slate-400">{new Date(item.scheduledAt).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-tharqiya-orange/10 flex items-center justify-center font-black text-tharqiya-orange text-xs text-tharqiya-deep overflow-hidden shrink-0">
                                                        {item.application?.student?.user?.profileImageUrl ? (
                                                            <img 
                                                                src={item.application.student.user.profileImageUrl} 
                                                                alt="Scholar" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            (item.application?.student?.user?.name || item.application?.student?.name)?.[0]
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tight">{item.application?.student?.user?.name || item.application?.student?.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.application?.student?.applicationNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-base text-emerald-500">{hifzMark}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">/100</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-base text-blue-500">{englishMark}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">/100</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-base text-tharqiya-orange">{generalMark}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">/100</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-tharqiya-orange hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-xl transition-all shadow-sm">
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center opacity-40">
                                            <Book size={48} className="mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No evaluation logs found in your registry</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </InterviewerLayout>
    );
};

export default InterviewerEvaluations;
