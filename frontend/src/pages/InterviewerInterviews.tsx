import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    ExternalLink, 
    CheckCircle2, 
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import InterviewerLayout from '../components/InterviewerLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const InterviewerInterviews: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const response = await api.get('/interviews/assigned');
                if (response.data.status === 'success') {
                    setInterviews(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && currentUser) {
            fetchInterviews();
        }
    }, [authLoading, currentUser]);

    const filteredInterviews = interviews.filter(interview => {
        const student = interview.application?.student;
        const name = (student?.user?.name || student?.name || '').toLowerCase();
        const appNo = (student?.applicationNo || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        const matchesSearch = name.includes(query) || appNo.includes(query);
        const isCompleted = (interview.evaluations?.length || 0) >= 3;
        
        if (filterStatus === 'pending') return matchesSearch && !isCompleted;
        if (filterStatus === 'completed') return matchesSearch && isCompleted;
        return matchesSearch;
    });

    return (
        <InterviewerLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tighter leading-none">
                            Assigned <span className="text-tharqiya-orange">Boards</span>
                        </h2>
                        <p className="text-[10px] font-bold text-tharqiya-deep/60 dark:text-slate-400 uppercase tracking-widest mt-2 px-1">Institutional Assessment Roster</p>
                    </div>

                    <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        {(['all', 'pending', 'completed'] as const).map((status) => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent ${filterStatus === status ? 'bg-tharqiya-orange text-white shadow-lg shadow-tharqiya-orange/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-slate-800'}`}
                            >
                                {status === 'all' ? 'All Sessions' : status === 'pending' ? 'Evaluation Queue' : 'Completed'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-tharqiya-deep/50 dark:text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by student name or application number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-sm shadow-sm focus:ring-4 focus:ring-tharqiya-orange/5 transition-all outline-none"
                    />
                </div>

                {/* Interviews Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/30 dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Institutional Database...</p>
                    </div>
                ) : filteredInterviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInterviews.map((interview, idx) => {
                            const isCompleted = (interview.evaluations?.length || 0) >= 3;
                            const student = interview.application?.student;
                            
                            return (
                                <motion.div 
                                    key={interview.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`group p-8 rounded-[2.5rem] border-2 bg-white dark:bg-slate-900 hover:scale-[1.02] transition-all flex flex-col justify-between h-full ${isCompleted ? 'border-emerald-500/10 hover:border-emerald-500/30 shadow-emerald-500/5 shadow-xl' : 'border-slate-100 dark:border-slate-800 hover:border-tharqiya-orange/30 shadow-xl'}`}
                                >
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-black text-2xl text-slate-300 group-hover:bg-tharqiya-orange/10 group-hover:text-tharqiya-orange transition-colors overflow-hidden">
                                                {student?.user?.profileImageUrl ? (
                                                    <img 
                                                        src={student.user.profileImageUrl} 
                                                        alt="Candidate" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (student?.user?.name || student?.name)?.[0]
                                                )}
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-tharqiya-orange/10 text-tharqiya-orange border-tharqiya-orange/20'}`}>
                                                {isCompleted ? 'Evaluated' : 'Pending Session'}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tight">{student?.user?.name || student?.name}</h4>
                                            <p className="text-[10px] font-black text-tharqiya-deep/60 dark:text-slate-400 uppercase tracking-widest mt-1">ID: {student?.applicationNo}</p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800/50 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="text-tharqiya-deep/60 dark:text-slate-400" size={14} />
                                                <span className="text-[10px] font-bold text-tharqiya-deep/80 dark:text-slate-400 uppercase tracking-widest">{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock className="text-tharqiya-deep/60 dark:text-slate-400" size={14} />
                                                <span className="text-[10px] font-bold text-tharqiya-deep/80 dark:text-slate-400 uppercase tracking-widest">{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="text-tharqiya-deep/60 dark:text-slate-400" size={14} />
                                                <span className="text-[10px] font-bold text-tharqiya-deep/80 dark:text-slate-400 uppercase tracking-widest truncate">{interview.location || 'College Campus'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <Link 
                                            to={isCompleted ? `/interviewer/evaluate/${interview.id}` : `/interviewer/evaluate/${interview.id}`}
                                            className={`flex-grow flex items-center justify-center gap-3 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all group ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-tharqiya-orange text-white shadow-lg shadow-tharqiya-orange/20 hover:bg-tharqiya-deep'}`}
                                        >
                                            {isCompleted ? <CheckCircle2 size={16} /> : <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />}
                                            {isCompleted ? 'View Board Marks' : 'Initiate Assessment'}
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center opacity-40">
                        <AlertCircle size={64} className="mb-4 text-slate-400" />
                        <h4 className="text-xl font-black font-outfit uppercase tracking-tighter">No matching appointments</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">Adjust your filters or search query</p>
                    </div>
                )}
            </div>
        </InterviewerLayout>
    );
};

export default InterviewerInterviews;
