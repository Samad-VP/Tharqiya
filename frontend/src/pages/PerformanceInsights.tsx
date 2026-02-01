import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart3, 
    ArrowLeft, 
    PieChart, 
    TrendingUp, 
    Users, 
    Target, 
    ShieldCheck,
    Loader2,
    Filter,
    UserPlus,
    ClipboardList,
    Award,
    UserCheck,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ChevronDown,
    MapPin
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PerformanceInsights: React.FC = () => {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCampus, setExpandedCampus] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await api.get('/principal/insights');
                setInsights(response.data.data);
            } catch (error) {
                toast.error('Failed to load insights data');
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-edu-teal animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aggregating Institutional Data...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <Link to="/principal" className="flex items-center gap-2 text-edu-teal text-[10px] font-black uppercase tracking-widest mb-4 hover:gap-4 transition-all">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h2 className="text-4xl lg:text-5xl font-black font-outfit tracking-tighter text-brand-deep dark:text-white uppercase leading-none">
                            Institutional <span className="text-edu-coral">Insights</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-3 ml-1">
                            Critical performance metrics and enrollment dynamics for Session 2026
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <Calendar size={14} /> Batch 2026
                        </button>
                        <button className="px-6 py-3 bg-edu-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-edu-coral/20 hover:scale-105 active:scale-95 transition-all">
                            <Filter size={14} /> Refine Data
                        </button>
                    </div>
                </div>

                {/* Main Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Evaluation Performance Profile */}
                    <motion.div 
                        variants={cardVariants}
                        className="lg:col-span-12 p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex flex-col lg:flex-row justify-between gap-12">
                            {/* Score Distribution - Left */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter flex items-center gap-3">
                                            <Target className="text-edu-teal" size={24} />
                                            Overall Score Spectrum
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bucket distribution based on institutional aggregate</p>
                                    </div>
                                    <BarChart3 className="text-slate-200 hidden sm:block" size={40} />
                                </div>

                                <div className="space-y-6">
                                    {Object.entries(insights?.scoreDistribution || {}).map(([range, count]: [string, any], i) => {
                                        const total = Object.values(insights.scoreDistribution).reduce((a: any, b: any) => a + b, 0) as number;
                                        const percentage = total > 0 ? (count / total) * 100 : 0;
                                        
                                        return (
                                            <div key={range} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{range} Marks</span>
                                                    <span className="text-xs font-black text-brand-deep dark:text-white">{count} Students <span className="text-edu-teal ml-2">{percentage.toFixed(0)}%</span></span>
                                                </div>
                                                <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${i === 0 ? 'from-edu-teal to-emerald-400' : i === 1 ? 'from-blue-500 to-indigo-400' : i === 2 ? 'from-edu-yellow to-amber-400' : 'from-edu-coral to-rose-400'}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Subject Wise Performance - Right */}
                            <div className="flex-1 lg:border-l border-slate-50 dark:border-slate-800 lg:pl-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter flex items-center gap-3">
                                            <Award className="text-edu-coral" size={24} />
                                            Subject Competency
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Average marks across core evaluation subjects</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {insights?.subjectPerformance?.map((subject: any, i: number) => (
                                        <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 group hover:border-edu-teal/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-edu-teal group-hover:scale-110 transition-transform">
                                                    {subject.subject === 'Hifz' ? <Users size={20} /> : subject.subject === 'English' ? <Target size={20} /> : <ClipboardList size={20} />}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-brand-deep dark:text-white font-outfit">{subject.average}</p>
                                                    <p className="text-[9px] font-black text-edu-teal uppercase tracking-widest">Avg Score</p>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{subject.subject}</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">From {subject.count} evaluations</p>
                                        </div>
                                    ))}
                                    {(!insights?.subjectPerformance || insights.subjectPerformance.length === 0) && (
                                        <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-300">
                                            <Loader2 className="animate-spin mb-2" size={20} />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Evaluation Data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Left: Campus Distribution */}
                    <motion.div 
                        variants={cardVariants}
                        className="lg:col-span-5 p-10 rounded-[2.5rem] bg-brand-deep text-white shadow-2xl relative overflow-hidden flex flex-col"
                    >
                        <div className="relative z-10 flex-grow">
                            <div 
                                className="flex items-start justify-between mb-8 cursor-pointer group/header"
                                onClick={() => setExpandedCampus(!expandedCampus)}
                            >
                                <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter leading-tight group-hover/header:text-edu-teal transition-colors">
                                    Campus <br/><span className="text-edu-teal group-hover/header:text-white transition-colors">Capacity Utilization</span>
                                </h3>
                                <button 
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/header:bg-white/20 transition-colors"
                                >
                                    <motion.div
                                        animate={{ rotate: expandedCampus ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown size={20} />
                                    </motion.div>
                                </button>
                            </div>
                            
                            <AnimatePresence>
                                {expandedCampus && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-8 pt-2">
                                            {insights?.campusDistribution?.map((campus: any, i: number) => {
                                                const utilization = (campus.currentCount / (campus.maxSeats || 1)) * 100;
                                                return (
                                                    <div key={i} className="flex items-center gap-6 group">
                                                        <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                                                            <svg className="w-full h-full -rotate-90">
                                                                <circle 
                                                                    cx="32" cy="32" r="28" 
                                                                    className="stroke-white/10 fill-none" 
                                                                    strokeWidth="4"
                                                                />
                                                                <motion.circle 
                                                                    cx="32" cy="32" r="28" 
                                                                    className="stroke-edu-teal fill-none" 
                                                                    strokeWidth="4"
                                                                    strokeDasharray="175"
                                                                    initial={{ strokeDashoffset: 175 }}
                                                                    animate={{ strokeDashoffset: 175 - (175 * (utilization / 100)) }}
                                                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                                                />
                                                            </svg>
                                                            <span className="absolute text-[10px] font-black">{campus.currentCount}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-outfit font-black text-lg group-hover:text-edu-teal transition-colors">{campus.campus}</p>
                                                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                                {campus.currentCount} / {campus.maxSeats} Seats Finalized
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(!insights?.campusDistribution || insights.campusDistribution.length === 0) && (
                                                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest text-center py-10 italic">No Campus Capacity Data</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <PieChart className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
                    </motion.div>

                    {/* Right: Admission Funnel */}
                    <motion.div 
                        variants={cardVariants}
                        className="lg:col-span-7 p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl"
                    >
                        <h3 className="text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-10">Admission <span className="text-edu-coral">Funnel Flow</span></h3>
                        
                        <div className="relative">
                            <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-slate-50 dark:bg-white/5 rounded-full" />
                            
                            <div className="space-y-6 relative">
                                {[
                                    { status: 'REGISTRATIONS', icon: UserPlus, color: 'bg-slate-500' },
                                    { status: 'EVALUATION', icon: ClipboardList, color: 'bg-blue-500' },
                                    { status: 'MERIT_LIST', icon: Award, color: 'bg-amber-500' },
                                    { status: 'ALLOTTED', icon: MapPin, color: 'bg-edu-yellow' },
                                    { status: 'AUTHORIZED', icon: UserCheck, color: 'bg-edu-teal' },
                                    { status: 'ENROLLED', icon: CheckCircle2, color: 'bg-emerald-500' }
                                ].map((step, i) => {
                                    const funnelStep = insights?.funnel?.[i];
                                    const count = funnelStep?.count || 0;
                                    const label = funnelStep?.label || step.status;

                                    return (
                                        <div key={i} className="flex items-center gap-8 group">
                                            <div className={`w-20 h-20 rounded-2xl ${step.color} shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform z-10 relative`}>
                                                <step.icon size={32} />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-brand-deep dark:text-white">
                                                    {count}
                                                </div>
                                            </div>
                                            <div className="flex-grow pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                                <h4 className="font-black text-brand-deep dark:text-white uppercase tracking-tighter text-lg">{label}</h4>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.status.replace('_', ' ')}</p>
                                                    <ChevronRight size={14} className="text-slate-200 group-hover:text-edu-teal transition-transform group-hover:translate-x-2" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Growth Trend / CTA */}
                <motion.div 
                    variants={cardVariants}
                    className="p-12 rounded-[3rem] bg-gradient-to-r from-edu-teal/10 via-white dark:via-slate-900 to-edu-coral/10 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <ShieldCheck className="mx-auto mb-6 text-edu-teal" size={48} />
                        <h3 className="text-3xl font-black font-outfit text-brand-deep dark:text-white tracking-tighter uppercase mb-4">Institutional Quality Assurance</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm lg:text-base">
                            The metrics above reflect our commitment to scholarly excellence. All data is synchronized across the Darussalam Edu Village node network in real-time.
                        </p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-30 pointer-events-none">
                        <TrendingUp className="w-full h-full text-edu-teal/5" />
                    </div>
                </motion.div>

            </motion.div>
        </AdminLayout>
    );
};

export default PerformanceInsights;
