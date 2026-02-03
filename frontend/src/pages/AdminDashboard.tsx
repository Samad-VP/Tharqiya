import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Clock, 
    CalendarCheck, 
    Trophy,
    ArrowUpRight,
    TrendingUp,
    Loader2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            if (!currentUser?.token) return;

            try {
                const response = await api.get('/admin/dashboard-stats');
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                toast.error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchStats();
        }
    }, [authLoading, currentUser]);

    const statCards = [
        { label: 'Total Applications', value: stats?.totalApplications || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '0%' },
        { label: 'Pending Review', value: stats?.pendingReview || '0', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '0%' },
        { label: 'Interviews Scheduled', value: stats?.interviewsScheduled || '0', icon: CalendarCheck, color: 'text-edu-teal', bg: 'bg-edu-teal/10', trend: '0%' },
        { label: 'Average Score', value: stats?.averageScore || '0.0', icon: Trophy, color: 'text-edu-coral', bg: 'bg-edu-coral/10', trend: '0' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Hero / Welcome */}
                <div className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter mb-3 sm:mb-4">
                            Welcome Back, Admin
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                                Track your admission metrics, manage scholar applications, and oversee the interview process from one central command center.
                            </p>
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
                                className="shrink-0 px-6 py-3 bg-edu-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-edu-teal/20 flex items-center gap-2"
                            >
                                <Users size={16} /> Export Roster
                            </button>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-edu-coral/20 blur-[100px] rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                            className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] sm:text-sm font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.trend} <TrendingUp size={14} className={stat.trend.startsWith('-') ? 'rotate-180' : ''} />
                                </div>
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit mb-1">{stat.value}</h3>
                            <p className="text-premium-xs text-slate-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Area Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl min-h-[300px] sm:min-h-[400px]">
                        <div className="flex justify-between items-center mb-6 sm:mb-10">
                            <div>
                                <h4 className="h-premium-md text-tharqiya-deep dark:text-white">Application Trends</h4>
                                <p className="text-premium-xs text-slate-500 leading-tight">Growth over the last 30 days</p>
                            </div>
                            <button className="p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-edu-coral transition-all">
                                <ArrowUpRight size={20} />
                            </button>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl">
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Chart Visualisation Placeholder</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
                        <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight mb-6 sm:mb-8">Recent Activities</h4>
                        <div className="space-y-4 sm:space-y-6">
                             {loading ? (
                                 <div className="flex justify-center py-10">
                                     <Loader2 className="w-6 h-6 text-edu-teal animate-spin" />
                                 </div>
                             ) : stats?.recentActivities?.length > 0 ? (
                                 stats.recentActivities.map((activity: any, i: number) => (
                                     <div key={i} className="flex gap-3 sm:gap-4 items-start pb-4 sm:pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                                         <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                                              <Users className="w-4 h-4 text-edu-teal" />
                                         </div>
                                         <div className="space-y-1 overflow-hidden">
                                             <p className="text-xs sm:text-sm font-bold text-tharqiya-deep dark:text-white truncate">{activity.title}</p>
                                             <p className="text-[10px] sm:text-xs text-slate-500 truncate">{activity.subtitle} • {new Date(activity.timestamp).toLocaleTimeString()}</p>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="flex flex-col items-center justify-center py-10 text-center">
                                     <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
                                         <Clock className="w-6 h-6 text-slate-300" />
                                     </div>
                                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent activities</p>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
