import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Trophy, 
    ChevronRight, 
    Loader2, 
    ArrowUpRight,
    MapPin,
    CheckCircle2,
    Shield,
    Zap,
    TrendingUp,
    ClipboardCheck,
    BarChart3
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const PrincipalDashboard: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/principal/dashboard-stats');
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching principal dashboard stats:', error);
                toast.error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Candidates', value: stats?.totalApplications || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Active applications' },
        { label: 'Avg Interview Score', value: stats?.averageScore || '0.0', icon: Trophy, color: 'text-edu-coral', bg: 'bg-edu-coral/10', desc: 'Institutional aggregate' },
        { label: 'Pending Allotment', value: stats?.pendingReview || '0', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Awaiting seat assignment' },
        { label: 'Finalized Seats', value: stats?.finalizedSeats || '0', icon: CheckCircle2, color: 'text-edu-teal', bg: 'bg-edu-teal/10', desc: 'Enrollment confirmed' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <AdminLayout>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                {/* Hero / Welcome */}
                <motion.div 
                    variants={itemVariants}
                    className="relative p-6 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500"
                >
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="h-premium-lg mb-4">
                                Principal’s <span className="text-edu-coral">Command Center</span>
                            </h2>
                            <p className="text-premium-body text-slate-500 dark:text-slate-400 max-w-xl">
                                Review candidate performance, oversee interview results, and finalize institutional allotments with institutional excellence.
                            </p>
                        </div>
                        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
                            <button 
                                onClick={async () => {
                                    const loadToast = toast.loading("Generating Roster PDF...");
                                    try {
                                        const response = await api.get('/admissions/applicants/pdf', { responseType: 'blob' });
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', `Applicants-Roster-${new Date().getTime()}.pdf`);
                                        document.body.appendChild(link);
                                        link.click();
                                        toast.success("Roster Exported", { id: loadToast });
                                    } catch (err) {
                                        toast.error("Failed to export roster", { id: loadToast });
                                    }
                                }}
                                className="px-6 py-3 bg-edu-coral text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-edu-coral/20 flex items-center gap-2"
                            >
                                <Users size={16} /> Candidate Roster
                            </button>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-edu-teal/10 flex items-center justify-center text-edu-teal border border-edu-teal/20 backdrop-blur-sm">
                                <Shield size={32} />
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-edu-teal/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-edu-coral/10 blur-[100px] rounded-full" />
                </motion.div>

                {/* Quick Stats */}
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                    {loading ? (
                         <div className="col-span-full flex items-center justify-center py-20">
                             <Loader2 className="w-10 h-10 text-edu-teal animate-spin" />
                         </div>
                    ) : statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-edu-teal transition-colors" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit mb-1">{stat.value}</h3>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-2">{stat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Actions Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-brand-deep to-[#1a1a1a] text-white shadow-2xl relative overflow-hidden group border border-white/5"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-edu-teal/20 flex items-center justify-center mb-6 border border-edu-teal/20 backdrop-blur-md">
                                <Zap size={24} className="text-edu-teal" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black font-outfit mb-3 sm:mb-4 uppercase tracking-tighter text-white">Allotment Engine</h3>
                            <p className="text-slate-100/90 text-sm sm:text-base font-medium mb-8 leading-relaxed max-w-md">
                                Deploy candidates to campuses based on their preference lists and interview scores. Propose and finalize enrollment lists.
                            </p>
                            <Link to="/principal/allotments">
                                <button className="w-full sm:w-auto px-8 py-4 bg-white text-brand-deep rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-edu-teal hover:text-white transition-all flex items-center justify-center gap-3">
                                    Manage Allotments <ChevronRight size={18} />
                                </button>
                            </Link>
                        </div>
                        <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-edu-teal/20 blur-[100px] rounded-full animate-pulse" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-edu-coral/10 flex items-center justify-center mb-6 border border-edu-coral/20">
                                <TrendingUp size={24} className="text-edu-coral" />
                            </div>
                            <h3 className="text-3xl font-black font-outfit text-brand-deep dark:text-white mb-4 uppercase tracking-tighter">Performance Insights</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed max-w-md">
                                View detailed analytics on evaluation consistency, score distributions, and academic performance across all batches.
                            </p>
                            <Link to="/principal/insights">
                                <button className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:text-edu-teal hover:bg-edu-teal/5 transition-all flex items-center justify-center gap-3">
                                    View Analytics <BarChart3 size={18} />
                                </button>
                            </Link>
                        </div>
                        <Trophy className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 dark:text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
                    </motion.div>
                </div>

                {/* Institutional Progress & Action Log Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                         <div className="flex items-center justify-between mb-8">
                            <h4 className="h-premium-md text-brand-deep dark:text-white flex items-center gap-3">
                                <ClipboardCheck className="text-edu-teal" size={24} />
                                Recent Approvals
                            </h4>
                            <span className="text-premium-xs px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400">Live Stream</span>
                        </div>
                        
                        <div className="space-y-4">
                            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                stats.recentActivities.map((activity: any, i: number) => {
                                    const actionLabels: Record<string, string> = {
                                        'APPROVE_ALLOTMENT_BATCH': 'Batch Allotment Finalized',
                                        'OVERRIDE_ALLOTMENT': 'Manual Allotment Override',
                                        'APPROVE_ALLOTMENT': 'Individual Allotment Approved'
                                    };

                                    return (
                                        <div key={activity.id || i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-black">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-deep dark:text-white">
                                                        {actionLabels[activity.action] || activity.action.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-slate-400">
                                                        {activity.actor} • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(activity.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                                {activity.metadata?.count ? `${activity.metadata.count} Seats` : 'Sync active'}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Recent Activity Recorded</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-8 sm:p-10 rounded-[2.5rem] bg-edu-yellow/10 border border-edu-yellow/20 dark:bg-slate-900 dark:border-slate-800 shadow-xl relative overflow-hidden"
                    >
                        <h4 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-8">System Health</h4>
                        <div className="space-y-6">
                            {[
                                { label: 'Notification Service', status: 'Optimal', color: 'text-emerald-500' },
                                { label: 'PDF Engine', status: 'Ready', color: 'text-emerald-500' },
                                { label: 'Audit Logging', status: 'Active', color: 'text-blue-500' },
                                { label: 'WA Integration', status: 'Syncing', color: 'text-amber-500' }
                            ].map((sys, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{sys.label}</span>
                                    <span className={`text-[10px] font-bold ${sys.color} uppercase tracking-widest flex items-center gap-1.5`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${sys.color.replace('text', 'bg')} animate-pulse`} />
                                        {sys.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Secure • SSL Active</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AdminLayout>
    );
};

export default PrincipalDashboard;
