import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Bell, 
    CheckCircle2, 
    XCircle, 
    Mail, 
    MessageSquare, 
    Phone, 
    Loader2,
    Calendar,
    User
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminNotificationLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/admin/notifications');
                setLogs(response.data.data);
            } catch (error) {
                toast.error('Failed to load notification logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'EMAIL': return <Mail size={16} className="text-blue-500" />;
            case 'WHATSAPP': return <MessageSquare size={16} className="text-emerald-500" />;
            default: return <Bell size={16} />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-black font-outfit tracking-tighter text-brand-deep dark:text-white uppercase">
                        Notification <span className="text-edu-teal">Audit</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 ml-1">
                        Monitoring institutional communication flow and delivery status
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Event</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Recipient</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Channel</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Sent At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <Loader2 className="w-10 h-10 text-edu-teal animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : logs.length > 0 ? logs.map((log, idx) => (
                                    <motion.tr 
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-brand-deep dark:text-white font-outfit text-sm">{log.event.replace(/_/g, ' ')}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px]" title={log.message}>{log.message}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-600 dark:text-slate-300">{log.user?.name || 'System'}</span>
                                                    <span className="text-[10px] text-slate-400">{log.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {getChannelIcon(log.type)}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{log.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${log.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {log.status === 'SENT' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {log.status}
                                            </span>
                                            {log.error && (
                                                <p className="text-[9px] text-red-400 mt-1 max-w-[150px] truncate" title={log.error}>{log.error}</p>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                <Calendar size={14} />
                                                <span className="text-[11px] font-bold">{new Date(log.sentAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                                            No notification logs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotificationLogs;
