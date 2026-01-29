import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    CheckCircle2, 
    XCircle, 
    Mail, 
    MessageSquare, 
    Loader2,
    Calendar,
    User,
    ChevronDown,
    ChevronRight,
    Search
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminNotificationLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserRole(response.data.data.user.role);
            } catch (error) {
                console.error('Failed to fetch user role');
            }
        };
        fetchUser();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/notifications');
            setLogs(response.data.data);
            // Default: Expand the first group if results exist
            if (response.data.data.length > 0) {
                setExpandedGroups(new Set([response.data.data[0].event]));
            }
        } catch (error) {
            toast.error('Failed to load notification logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const toggleGroup = (event: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(event)) {
            newExpanded.delete(event);
        } else {
            newExpanded.add(event);
        }
        setExpandedGroups(newExpanded);
    };

    const formatLogMessage = (message: string) => {
        try {
            const parsed = JSON.parse(message);
            if (typeof parsed === 'object') {
                return Object.entries(parsed)
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ') + (Object.keys(parsed).length > 3 ? '...' : '');
            }
        } catch (e) {
            return message.replace(/<[^>]*>/g, ' ').substring(0, 500);
        }
        return message;
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'EMAIL': return <Mail size={16} className="text-blue-500" />;
            case 'WHATSAPP': return <MessageSquare size={16} className="text-emerald-500" />;
            default: return <Bell size={16} />;
        }
    };

    // Filter and Group logs
    const filteredLogs = logs.filter(log => 
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedLogs = filteredLogs.reduce((acc: any, log: any) => {
        const event = log.event;
        if (!acc[event]) acc[event] = [];
        acc[event].push(log);
        return acc;
    }, {});

    const sortedEvents = Object.keys(groupedLogs).sort();

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-brand-deep dark:text-white uppercase">
                            Notification <span className="text-edu-teal">Audit</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 ml-1">
                            Status-based institutional communication flow
                        </p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-edu-teal transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search logs, events, students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-brand-deep dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-edu-teal/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <Loader2 className="w-12 h-12 text-edu-teal animate-spin" />
                        <p className="mt-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Compiling Audit Logs...</p>
                    </div>
                ) : sortedEvents.length > 0 ? (
                    <div className="space-y-6">
                        {sortedEvents.map((event) => {
                            const eventLogs = groupedLogs[event];
                            const isExpanded = expandedGroups.has(event);

                            return (
                                <motion.div 
                                    key={event}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Group Header */}
                                    <button 
                                        onClick={() => toggleGroup(event)}
                                        className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-edu-teal/10 flex items-center justify-center text-edu-teal">
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-black font-outfit text-brand-deep dark:text-white tracking-tight uppercase">
                                                    {event.replace(/_/g, ' ')}
                                                </h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {eventLogs.length} Total Logs
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {eventLogs.slice(0, 3).map((log: any, i: number) => (
                                                    <div 
                                                        key={i} 
                                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-edu-teal/20 flex items-center justify-center text-[10px] font-black text-edu-teal uppercase"
                                                    >
                                                        {log.user?.name?.[0] || 'S'}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-edu-teal px-3 py-1 bg-edu-teal/10 rounded-full uppercase tracking-tighter">
                                                Stage {sortedEvents.indexOf(event) + 1}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Group Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100 dark:border-slate-800"
                                            >
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                                                <th className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Recipient</th>
                                                                <th className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Audit Info</th>
                                                                <th className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                                                                <th className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Sent At</th>
                                                                <th className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                            {eventLogs.map((log: any) => (
                                                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-400 text-xs">
                                                                                {log.user?.name?.[0]?.toUpperCase() || 'S'}
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className="font-bold text-brand-deep dark:text-white">{log.user?.name || 'System'}</span>
                                                                                <span className="text-[10px] text-slate-400">{log.user?.email || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="flex items-center gap-2">
                                                                                {getChannelIcon(log.type)}
                                                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{log.type}</span>
                                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                                <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{log.senderEmail || 'System'}</span>
                                                                            </div>
                                                                            <span className="text-[10px] font-bold text-slate-400 line-clamp-1 max-w-[300px]" title={log.message}>
                                                                                {formatLogMessage(log.message)}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex flex-col">
                                                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 w-fit ${log.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                                {log.status === 'SENT' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                                                {log.status}
                                                                            </span>
                                                                            {log.error && (
                                                                                <p className="text-[9px] text-red-400 mt-1 font-bold animate-pulse">{log.error}</p>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4 text-right">
                                                                        <span className="text-[11px] font-black text-slate-500">{new Date(log.sentAt).toLocaleString()}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4 text-right">
                                                                        {userRole !== 'PRINCIPAL' && log.status === 'FAILED' && (
                                                                            <button 
                                                                                onClick={async () => {
                                                                                    const loadToast = toast.loading("Resending...");
                                                                                    try {
                                                                                        await api.post(`/admin/notifications/${log.id}/retry`);
                                                                                        toast.success("Resent!", { id: loadToast });
                                                                                        await fetchLogs();
                                                                                    } catch (err: any) {
                                                                                        toast.error(err.response?.data?.message || "Failed", { id: loadToast });
                                                                                    }
                                                                                }}
                                                                                className="p-2 bg-edu-teal/10 text-edu-teal rounded-xl hover:bg-edu-teal hover:text-white transition-all shadow-sm"
                                                                            >
                                                                                <Bell size={14} />
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 mb-4">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-xl font-black font-outfit text-brand-deep dark:text-white tracking-tight uppercase">Audit Stream Clear</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">No notification events recorded / matching your search</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminNotificationLogs;
