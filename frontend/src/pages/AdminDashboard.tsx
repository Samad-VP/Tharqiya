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

    const handleAccept = async (applicationId: string) => {
        const loadToast = toast.loading("Enrolling student...");
        try {
            await api.post(`/admin/applications/${applicationId}/accept`);
            toast.success("Student Enrolled Officially", { id: loadToast });
            // Refresh stats to update table
            const response = await api.get('/admin/dashboard-stats');
            setStats(response.data.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to enroll student", { id: loadToast });
        }
    };

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
                        <div className="w-full h-[250px] flex items-end justify-between gap-2 px-2 pb-2">
                             {loading ? (
                                 <div className="w-full h-full flex items-center justify-center">
                                     <Loader2 className="w-8 h-8 text-edu-teal animate-spin" />
                                 </div>
                             ) : stats?.applicationTrends?.length > 0 ? (
                                 stats.applicationTrends.map((trend: any, i: number) => (
                                     <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative pt-4">
                                         {/* Tooltip on Hover */}
                                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-tharqiya-deep text-white px-2 py-1 rounded text-[10px] font-black z-20 pointer-events-none whitespace-nowrap">
                                             {trend.count} Applications
                                         </div>
                                         
                                         <motion.div 
                                             initial={{ height: 0 }}
                                             animate={{ height: `${(trend.count / Math.max(...stats.applicationTrends.map((t: any) => t.count), 1)) * 100}%` }}
                                             transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                             className="w-full bg-gradient-to-t from-edu-teal to-edu-teal/40 rounded-t-xl group-hover:from-edu-coral group-hover:to-edu-coral/40 transition-colors relative"
                                         >
                                             <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-full blur-sm" />
                                         </motion.div>
                                         
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter w-full text-center truncate">
                                             {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                         </p>
                                     </div>
                                 ))
                             ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                    <TrendingUp size={40} className="text-slate-100 dark:text-slate-800 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Insufficient Data for Trends</p>
                                </div>
                             )}
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

                {/* Allotment Verification Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden mt-8">
                    <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">Allotment Verification</h4>
                            <p className="text-premium-xs text-slate-500 mt-1">Review and track students who have secured their seats</p>
                        </div>
                        <div className="px-5 py-2 rounded-2xl bg-edu-teal/10 text-edu-teal font-black text-[10px] uppercase tracking-widest border border-edu-teal/20 w-fit">
                            {stats?.allottedStudents?.length || 0} New Allotments
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Student Details</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Assigned Campus</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Course</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Enrollment Status</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center">
                                            <Loader2 className="w-8 h-8 text-edu-teal animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : stats?.allottedStudents?.length > 0 ? (
                                    stats.allottedStudents.map((app: any, idx: number) => (
                                        <motion.tr 
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs border border-edu-teal/20">
                                                        {app.student?.user?.profileImageUrl ? (
                                                            <img src={app.student.user.profileImageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                                        ) : (app.student?.user?.name?.[0] || app.student?.name?.[0])}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tight text-sm">
                                                            {app.student?.user?.name || app.student?.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                            {app.student?.applicationNo}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1.5 rounded-xl bg-edu-coral/10 text-edu-coral font-black text-[10px] uppercase tracking-widest border border-edu-coral/10">
                                                    {app.allotment?.campus || 'TBD'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-tharqiya-deep dark:text-slate-300 text-[11px] uppercase tracking-tight">
                                                    {app.allotment?.course || 'Pending Selection'}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${app.status === 'ACCEPTED' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-blue-600'}`}>
                                                        {app.status === 'ACCEPTED' ? 'Admission Confirmed' : 'Allotment Issued'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {app.status === 'ACCEPTED' ? (
                                                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-[9px] uppercase tracking-widest border border-emerald-500/20">
                                                        Enrolled
                                                    </span>
                                                ) : app.status === 'ADMISSION_AUTHORIZED' ? (
                                                    <button 
                                                        onClick={() => handleAccept(app.id)}
                                                        className="px-4 py-2 rounded-xl bg-edu-teal text-white hover:bg-edu-teal/90 font-bold text-[9px] uppercase tracking-widest transition-all shadow-md shadow-edu-teal/10"
                                                    >
                                                        Accept Enrollment
                                                    </button>
                                                ) : (
                                                    <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-teal hover:bg-edu-teal/10 font-bold text-[9px] uppercase tracking-widest transition-all border border-transparent hover:border-edu-teal/20">
                                                        Verify Docs
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-slate-200" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No students found in allotment pipeline</p>
                                            </div>
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

export default AdminDashboard;
