import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { 
    CheckSquare, 
    ShieldCheck, 
    Download, 
    MapPin, 
    BookOpen, 
    TrendingUp, 
    FileText, 
    User,
    AlertCircle,
    Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ApplicationData {
    id: string;
    applicationNo: string;
    status: string;
    application: {
        status: string;
        appliedAt: string;
        allotment?: {
            campus: string;
            course: string;
            isFinalized: boolean;
        }
    };
}

const StudentAllotment: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [appData, setAppData] = useState<ApplicationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admissions/my-status');
            setAppData(response.data.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load admission data');
            toast.error('Failed to load admission data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchStatus();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [authLoading, user]);

    const handleDownload = async (type: 'result' | 'allotment') => {
        try {
            const response = await api.get(`/admissions/my-${type}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-${appData?.applicationNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success(`${type} PDF downloaded successfully`);
        } catch (err: any) {
            toast.error(`Failed to download ${type}. Please try again.`);
        }
    };

    if (authLoading || (loading && user)) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-edu-teal border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-[10px]">Retrieving Allotment Records...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 p-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black font-outfit text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border mb-2 tracking-tight uppercase">Access Denied</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-sm text-sm">{error}</p>
            <button onClick={fetchStatus} className="bg-edu-teal text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Re-authenticate</button>
        </div>
    );

    if (!appData?.application.allotment) return (
        <div className="max-w-4xl mx-auto py-20 px-6 text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border mb-6 tracking-tight font-outfit uppercase">Selection Board Decision Pending</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-12 font-medium text-sm sm:text-base leading-relaxed">
                Your application is currently in the Selection Board's review pipeline. Once your campus allotment is finalized or updated, the details will appear here.
            </p>
            <Link to="/student/portal">
                <button className="text-edu-teal font-black uppercase tracking-widest text-sm hover:gap-4 transition-all flex items-center gap-2 mx-auto">
                    Return to Dashboard Home
                </button>
            </Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                {/* Header Title */}
                <div className="text-center md:text-left mb-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit tracking-tighter uppercase">Selection Board <span className="text-edu-teal">Decision</span></h1>
                    <p className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-3">Authenticated Allotment Record for 2026 Batch</p>
                </div>

                {/* Component 1: Selection Board Card */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-edu-teal/10 flex items-center justify-center text-edu-teal shadow-sm">
                            <MapPin size={22} />
                        </div>
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-slate-200 font-outfit uppercase tracking-tighter">Campus & Programme <span className="text-edu-teal">Allotment</span></h3>
                    </div>

                    <div className="p-8 sm:p-12 lg:p-20 rounded-[3rem] bg-tharqiya-deep bg-gradient-to-br from-edu-teal via-tharqiya-deep to-slate-950 text-white shadow-2xl relative overflow-hidden group ring-[12px] ring-edu-teal/10">
                        {/* Subtle Overlay for Visibility */}
                        <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="flex flex-col items-center text-center md:items-start md:text-left flex-grow">
                                <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-8 border border-white/20 flex items-center gap-2 shadow-sm">
                                    <ShieldCheck size={14} className="text-edu-yellow" />
                                    Official Selection Board
                                </span>
                                <h4 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit mb-4 leading-tight tracking-tighter text-white bg-none bg-clip-border drop-shadow-xl">
                                    Welcome to<br />
                                    <span className="text-edu-teal block mt-4 text-2xl sm:text-4xl lg:text-5xl break-words max-w-2xl bg-none bg-clip-border">{appData.application.allotment.campus}</span>
                                </h4>
                                <div className="mt-8 border-l-2 border-edu-teal/30 pl-5 py-1">
                                    <p className="text-teal-50/90 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs max-w-md">
                                        Authenticated Allotment for the academic session of 2026.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full md:w-72 space-y-5 shrink-0">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner group/item hover:bg-white/10 transition-colors">
                                    <p className="text-[9px] font-black text-teal-100/70 uppercase tracking-[0.2em] mb-1.5">Assigned Programme</p>
                                    <p className="text-sm sm:text-base font-black text-white">{appData.application.allotment.course}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner group/item hover:bg-white/10 transition-colors">
                                    <p className="text-[9px] font-black text-teal-100/70 uppercase tracking-[0.2em] mb-1.5">Campus Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                        <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">Operational</p>
                                    </div>
                                </div>
                                
                                {/* Allotment Letter Download Moved to Actions Section */}
                            </div>
                        </div>
                        <MapPin className="absolute -bottom-16 -right-16 w-64 h-64 text-white/5 group-hover:rotate-12 group-hover:scale-120 transition-transform duration-1000" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-edu-teal/20 blur-[100px] rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Component 2: Onboarding & Actions */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-edu-yellow/10 flex items-center justify-center text-edu-yellow shadow-sm">
                            <CheckSquare size={22} />
                        </div>
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit uppercase tracking-tighter">Onboarding & <span className="text-edu-yellow">Actions</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Admission Action */}
                        <div className="md:col-span-2">
                            {appData.application.status === 'ADMISSION_AUTHORIZED' || appData.application.status === 'ALLOTTED' ? (
                                <div className="p-8 rounded-[2rem] bg-tharqiya-cream dark:bg-slate-900 border-2 border-dashed border-edu-teal/30 flex flex-col items-center text-center gap-6">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 max-w-md">Your admission is authorized. Please confirm your seat to begin your journey with us.</p>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }} animate={{ scale: [1, 1.01, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={async () => {
                                            try {
                                                const res = await api.post('/admissions/confirm');
                                                toast.success(res.data.message);
                                                fetchStatus();
                                            } catch (err: any) {
                                                toast.error(err.response?.data?.message || 'Confirmation failed');
                                            }
                                        }}
                                        className="w-full sm:w-auto px-12 h-16 bg-edu-teal text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-edu-teal/20 transition-all font-outfit"
                                    >
                                        Finalize Admission Confirmation
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="p-8 rounded-[2rem] bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                            <CheckSquare size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Enrolled Member</p>
                                            <p className="text-lg font-black text-tharqiya-deep dark:text-white font-outfit">Admission Successfully Confirmed</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-10 w-[1px] bg-emerald-500/20" />
                                    <p className="hidden sm:block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batch 2026</p>
                                </div>
                            )}
                        </div>

                        {/* Secondary Actions */}
                        {(appData.application.status === 'ACCEPTED' || appData.application.status === 'REJECTED') && (
                            <>
                                <motion.button
                                    whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDownload('result')}
                                    className="w-full h-20 bg-edu-yellow text-tharqiya-deep rounded-[2rem] font-black text-sm shadow-lg shadow-edu-yellow/20 flex items-center justify-center gap-4 uppercase tracking-[0.2em] transition-all font-outfit"
                                >
                                    <Download className="w-6 h-6" />
                                    Official Selection Letter
                                </motion.button>

                                {appData.application.status === 'ACCEPTED' && (
                                    <motion.button
                                        whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(13, 148, 136, 0.3)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDownload('allotment')}
                                        className="w-full h-20 bg-white text-edu-teal border-2 border-edu-teal/20 rounded-[2rem] font-black text-sm shadow-lg shadow-edu-teal/10 flex items-center justify-center gap-4 uppercase tracking-[0.2em] transition-all font-outfit"
                                    >
                                        <FileText className="w-6 h-6" />
                                        Official Allotment Letter
                                    </motion.button>
                                )}
                                

                            </>
                        )}
                    </div>
                </div>

                {/* Component 3: Journey Milestones */}
                <div className="space-y-6 pt-12">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                            <TrendingUp size={22} />
                        </div>
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit uppercase tracking-tighter">Admission <span className="text-blue-500">Journey</span></h3>
                    </div>

                    <div className="p-10 sm:p-14 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-6">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden lg:block absolute top-10 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                            
                            {[
                                { label: 'Application Submitted', desc: 'Dossier Received', icon: FileText, active: true },
                                { label: 'Documentation Verified', desc: 'Profile Authenticated', icon: CheckSquare, active: ['DOCS_VERIFIED', 'REVIEWED', 'INTERVIEW_SCHEDULED', 'EVALUATED', 'ALLOTMENT_READY', 'ALLOTTED', 'ADMISSION_AUTHORIZED', 'ACCEPTED'].includes(appData.application.status) },
                                { label: 'Interview Processed', desc: 'Panel Evaluation Base', icon: User, active: ['EVALUATED', 'ALLOTMENT_READY', 'ALLOTTED', 'ADMISSION_AUTHORIZED', 'ACCEPTED'].includes(appData.application.status) },
                                { label: 'Campus Allotted', desc: 'Programme Confirmation', icon: MapPin, active: ['ALLOTTED', 'ADMISSION_AUTHORIZED', 'ACCEPTED'].includes(appData.application.status) },
                                { label: 'Final Enrollment', desc: 'Admission Secured', icon: Trophy, active: appData.application.status === 'ACCEPTED' },
                            ].map((m, i) => (
                                <div key={i} className="relative z-10 flex lg:flex-col items-center lg:text-center gap-6 lg:gap-5 flex-1 w-full lg:w-auto overflow-visible">
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-2xl ${m.active ? 'bg-gradient-to-br from-edu-teal to-tharqiya-deep text-white scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                                        <m.icon size={28} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`text-xs sm:text-sm font-black uppercase tracking-widest leading-tight mb-1 ${m.active ? 'text-tharqiya-deep dark:text-white' : 'text-slate-400'}`}>{m.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-60">{m.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentAllotment;
