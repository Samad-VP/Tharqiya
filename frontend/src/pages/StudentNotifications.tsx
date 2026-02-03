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
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 sm:gap-6"
            >
                <Link to="/student/portal" className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-edu-coral transition-all shadow-sm group">
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform duration-300" />
                </Link>
                <div>
                    <h2 className="text-3xl sm:text-5xl font-black font-outfit tracking-tighter text-tharqiya-deep dark:text-white uppercase leading-none">
                        <span className="text-edu-coral">Notifications</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Official Transmission History</p>
                </div>
            </motion.div>

            <div className="space-y-6 sm:space-y-8">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-edu-coral animate-spin mb-6" />
                            <div className="absolute inset-0 bg-edu-coral/20 blur-2xl rounded-full animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Synchronizing Archives...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="space-y-4 sm:space-y-6"
                    >
                        {notifications.map((notif, idx) => (
                            <motion.div 
                                key={notif.id || idx}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8 group relative overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-white/80 dark:hover:bg-slate-900/80"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-950/30 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-start gap-6 sm:gap-8">
                                    <div className={`p-5 rounded-[1.5rem] shadow-lg ${
                                        notif.type === 'EMAIL' 
                                        ? 'bg-blue-500/10 text-blue-500 shadow-blue-500/10' 
                                        : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'
                                    } group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        {notif.type === 'EMAIL' ? <Mail size={28} /> : <MessageSquare size={28} />}
                                    </div>
                                    
                                    <div className="flex-grow space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl sm:text-2xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tighter leading-none">
                                                {notif.event.replace(/_/g, ' ')}
                                            </h3>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                    notif.status === 'SENT' 
                                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                                    : 'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                    {notif.status}
                                                </span>
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest md:hidden">
                                                    {notif.type}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-4 py-1">
                                            "{formatLogMessage(notif.message)}..."
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-slate-400 pt-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="opacity-50" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {new Date(notif.sentAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {new Date(notif.sentAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6 self-end md:self-center">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Transmission Channel</p>
                                        <p className="text-sm font-black text-tharqiya-deep dark:text-white uppercase tracking-tighter">{notif.type}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                        notif.status === 'SENT' 
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white shadow-emerald-500/10' 
                                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white shadow-rose-500/10'
                                    } group-hover:shadow-2xl group-hover:scale-110`}>
                                        {notif.status === 'SENT' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-32 text-center glass-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                            <Mail size={40} className="opacity-20" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter mb-2">Silence in the Inbox</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No transmissions have been broadcast to your profile yet.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
