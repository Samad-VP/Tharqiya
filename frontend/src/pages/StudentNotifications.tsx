import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Mail, 
    MessageSquare, 
    CheckCircle2, 
    XCircle, 
    Loader2,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const StudentNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/admissions/my-notifications');
                setNotifications(response.data.data);
            } catch (error) {
                toast.error('Failed to load notification history');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const formatLogMessage = (message: string) => {
        // Strip HTML for student view list
        return message.replace(/<[^>]*>/g, ' ').substring(0, 150);
    };

    return (
        <div className="min-h-screen bg-tharqiya-cream dark:bg-slate-950 pt-32 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/portal" className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-tharqiya-orange transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-tharqiya-deep dark:text-white uppercase">
                            Communication <span className="text-tharqiya-orange">History</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                            Official updates sent to your registered channels
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Communications...</p>
                        </div>
                    ) : notifications.length > 0 ? notifications.map((notif, idx) => (
                        <motion.div 
                            key={notif.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                        >
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-2xl ${notif.type === 'EMAIL' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {notif.type === 'EMAIL' ? <Mail size={24} /> : <MessageSquare size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tight leading-none">{notif.event.replace(/_/g, ' ')}</h3>
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${notif.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {notif.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 italic mb-3">
                                        "{formatLogMessage(notif.message)}..."
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={14} />
                                        <span className="text-[11px] font-bold">{new Date(notif.sentAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Channel</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{notif.type}</p>
                                </div>
                                {notif.type === 'EMAIL' && (
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <CheckCircle2 size={18} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )) : (
                        <div className="py-20 text-center glass-card rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No official communications found yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentNotifications;
