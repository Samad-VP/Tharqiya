import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Trophy, 
    ChevronRight, 
    Loader2, 
    ArrowUpRight,
    MapPin,
    CheckCircle2
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
                // Fetch stats (using admin endpoint as it's allowed for Principal too if we want, or create a specific one)
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
        { label: 'Total Candidates', value: stats?.totalApplications || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Avg Interview Score', value: stats?.averageScore || '0.0', icon: Trophy, color: 'text-edu-coral', bg: 'bg-edu-coral/10' },
        { label: 'Pending Allotment', value: stats?.pendingReview || '0', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Finalized Seats', value: '0', icon: CheckCircle2, color: 'text-edu-teal', bg: 'bg-edu-teal/10' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Hero / Welcome */}
                <div className="relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black font-outfit tracking-tighter mb-4">
                            Principal’s <span className="text-edu-coral">Command Center</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                            Review candidate performance, oversee interview results, and finalize institutional allotments with institutional excellence.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-edu-teal/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-edu-coral/20 blur-[100px] rounded-full" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <ArrowUpRight size={20} className="text-slate-300 group-hover:text-edu-teal transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-brand-deep dark:text-white font-outfit mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Actions Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-[2.5rem] bg-gradient-to-br from-edu-teal to-brand-deep text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black font-outfit mb-4">Allotment Engine</h3>
                            <p className="text-edu-teal-100 font-medium mb-8 leading-relaxed">
                                Deploy candidates to campuses based on their preference lists and interview scores. Propose and finalize enrollment lists.
                            </p>
                            <Link to="/principal/allotments">
                                <button className="px-8 py-4 bg-white text-brand-deep rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-edu-teal transition-all flex items-center gap-2">
                                    Manage Allotments <ChevronRight size={18} />
                                </button>
                            </Link>
                        </div>
                        <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group"
                    >
                        <h3 className="text-3xl font-black font-outfit text-brand-deep dark:text-white mb-4">Performance Insights</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                            View detailed analytics on hifz evaluation consistency and academic performance across all applicant batches.
                        </p>
                        <button className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:text-edu-teal transition-all flex items-center gap-2">
                            View Analytics <ChevronRight size={18} />
                        </button>
                        <Trophy className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 dark:text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PrincipalDashboard;
