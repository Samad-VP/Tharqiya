import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Timer, FolderOpen, CheckSquare, ShieldAlert, Sparkles, Download, Bell, AlertCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplicationData {
    id: string;
    applicationNo: string;
    hifzCenter: string;
    status: string;
    dob: string;
    place: string;
    district: string;
    address: string;
    fatherName: string;
    application: {
        appliedAt: string;
        interview?: {
            scheduledAt: string;
            location: string;
            interviewer?: {
                user: {
                    name: string;
                    email: string;
                    phone: string;
                }
            }
        },
        allotment?: {
            campus: string;
            status: string;
        }
    };
    resources?: any;
}

const StudentPortal: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [appData, setAppData] = useState<ApplicationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [standards, setStandards] = useState<any>(null);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data.status === 'success') {
                setStandards(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchStatus = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admissions/my-status');
            setAppData(response.data.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load application data');
            toast.error('Failed to load application data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchStatus();
            fetchSettings();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [authLoading, user]);

    const handleDownload = async (type: 'application' | 'result') => {
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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return { icon: <CheckSquare className="w-12 h-12" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            case 'REJECTED': return { icon: <ShieldAlert className="w-12 h-12" />, color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'ALLOTTED': return { icon: <Sparkles className="w-12 h-12" />, color: 'text-edu-teal', bg: 'bg-edu-teal/10' };
            case 'PENDING': return { icon: <Timer className="w-12 h-12" />, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            default: return { icon: <FolderOpen className="w-12 h-12" />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        }
    };

    if (authLoading || (loading && user)) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-tharqiya-cream dark:bg-slate-950">
            <div className="w-16 h-16 border-4 border-tharqiya-orange border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">Awaiting Scholar Data...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-tharqiya-cream dark:bg-slate-950 p-6">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black font-outfit text-tharqiya-deep dark:text-white mb-2 tracking-tight">Data Retrieval Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center max-w-sm">{error}</p>
            <button onClick={fetchStatus} className="btn-primary px-8">Try Again</button>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-tharqiya-cream dark:bg-slate-950">
            <div className="text-center">
                <h2 className="text-2xl font-black font-outfit text-tharqiya-deep dark:text-white mb-4 tracking-tight">Unauthorized Session</h2>
                <a href="/login" className="btn-primary px-8">Return to Login</a>
            </div>
        </div>
    );

    const statusStyle = appData ? getStatusStyles(appData.status) : null;

    return (
        <div className="min-h-screen bg-tharqiya-cream dark:bg-slate-950 pt-32 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 rounded-[2.5rem] mb-10 overflow-hidden relative border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-28 h-28 bg-tharqiya-cream rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3 overflow-hidden p-3 border border-slate-100">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                                <Sparkles className="w-5 h-5 text-tharqiya-gold" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter mb-2">
                                Assalam-u-Alaikum, <span className="text-transparent bg-clip-text bg-gradient-to-r from-tharqiya-orange to-tharqiya-gold dark:from-tharqiya-gold dark:to-tharqiya-gold">{user.name.split(' ')[0]}</span>
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-black uppercase tracking-widest">Candidate ID: {user.id.slice(0, 8)}</span>
                                <span className="px-4 py-1.5 bg-tharqiya-orange/10 dark:bg-tharqiya-gold/10 text-tharqiya-orange dark:text-tharqiya-gold rounded-full text-xs font-black uppercase tracking-widest border border-tharqiya-orange/20 dark:border-tharqiya-gold/20">Post-Hifz 2026</span>
                            </div>
                        </div>
                        <div className="md:ml-auto flex items-center gap-4">
                            <Link to="/student/profile" className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:text-tharqiya-orange transition-colors">
                                My Profile
                            </Link>
                            <Link to="/student/notifications" className="p-4 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl relative hover:text-tharqiya-orange dark:hover:text-tharqiya-gold transition-colors">
                                <Bell size={24} />
                                <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {!appData ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-24 text-center rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FolderOpen className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-black text-tharqiya-deep dark:text-white mb-4 tracking-tight font-outfit">Your Journey Awaits</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium">You haven't initiated your admission process yet. Start your application to become a Tharqawi scholar.</p>
                        <button className="btn-primary px-12 py-5 text-xl">Initiate Application</button>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-tharqiya-orange dark:bg-tharqiya-gold" />
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight">Application Dossier</h3>
                                    <button onClick={() => handleDownload('application')} className="flex items-center gap-2 text-xs font-black text-tharqiya-orange dark:text-tharqiya-gold uppercase tracking-widest hover:underline">
                                        <Download size={14} /> Download PDF
                                    </button>
                                </div>
                                <div className="grid gap-6">
                                    {[
                                        { label: 'Application Number', value: appData.applicationNo, highlight: true },
                                        { label: 'Place & District', value: `${appData.place}, ${appData.district}` },
                                        { label: 'Hifz Institution', value: appData.hifzCenter },
                                        { label: 'Submission Timestamp', value: new Date(appData.application.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                        { label: 'Guardian', value: appData.fatherName },
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{row.label}</span>
                                            <span className={`font-bold text-lg ${row.highlight ? 'text-tharqiya-orange dark:text-tharqiya-gold' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {appData.application.interview && (
                                <div className="glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                                     <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white mb-8 font-outfit tracking-tight">Interview Details</h3>
                                     <div className="grid md:grid-cols-2 gap-10">
                                         <div className="space-y-6">
                                             <div>
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled At</p>
                                                 <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                                     {new Date(appData.application.interview.scheduledAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                                                 </p>
                                             </div>
                                             <div>
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue / Location</p>
                                                 <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{appData.application.interview.location}</p>
                                             </div>
                                         </div>
                                         {appData.application.interview.interviewer && (
                                             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Assigned Interviewer</p>
                                                 <h4 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit mb-2">{appData.application.interview.interviewer.user.name}</h4>
                                                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{appData.application.interview.interviewer.user.email}</p>
                                             </div>
                                         )}
                                     </div>
                                </div>
                            )}

                            <div className="glass-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white mb-8 font-outfit tracking-tight">Academic Resources</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:bg-tharqiya-orange/5 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                                <Sparkles className="text-tharqiya-orange" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-tharqiya-deep dark:text-white text-sm">Tharqiya Guide</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF - 2.4 MB</p>
                                            </div>
                                        </div>
                                        <Download size={20} className="text-slate-300 group-hover:text-tharqiya-orange" />
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:bg-tharqiya-orange/5 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                                <FolderOpen className="text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-tharqiya-deep dark:text-white text-sm">Syllabus 2026</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF - 1.1 MB</p>
                                            </div>
                                        </div>
                                        <Download size={20} className="text-slate-300 group-hover:text-blue-500" />
                                    </div>
                                </div>

                                {standards && (
                                    <div className="glass-card p-10 rounded-[2.5rem] border border-tharqiya-gold/20 relative overflow-hidden mt-8">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tight">Academic <span className="text-tharqiya-gold">Benchmarking</span></h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Minimum standard required for successful admission</p>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {[
                                                    { label: 'Hifz', value: standards.PASS_MARK_HIFZ, color: 'text-emerald-500' },
                                                    { label: 'English', value: standards.PASS_MARK_ENGLISH, color: 'text-blue-500' },
                                                    { label: 'General Knowledge', value: standards.PASS_MARK_GENERAL, color: 'text-tharqiya-orange' }
                                                ].map((s, i) => (
                                                    <div key={i} className="px-6 py-4 rounded-3xl bg-tharqiya-cream dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                                        <p className={`text-xl font-black ${s.color}`}>{s.value}%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[2.5rem] text-center border border-slate-100 dark:border-slate-800 relative group">
                                <div className={`w-28 h-28 ${statusStyle?.bg} ${statusStyle?.color} rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                                    {statusStyle?.icon}
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-2">Current Milestone</span>
                                <h3 className={`text-3xl font-black font-outfit tracking-tighter ${statusStyle?.color}`}>{appData.status}</h3>
                                <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {appData.status === 'PENDING' ? 'Your sacred application is currently undergoing scholarly review at Darussalam Edu Village.' :
                                            appData.status === 'INTERVIEW_SCHEDULED' ? 'You have been selected for the evaluation round. Please monitor your digital channels.' :
                                            appData.status === 'ALLOTTED' ? 'Congratulations! You have been allotted a seat. Please review the details and confirm your admission below.' :
                                                'Final evolutionary phase completed. Welcome to Tharqiya.'}
                                    </p>
                                </div>

                                {appData.status === 'ALLOTTED' && appData.application.allotment && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                        className="mt-6 p-8 rounded-3xl bg-gradient-to-br from-edu-teal to-brand-deep text-white shadow-xl relative overflow-hidden group"
                                    >
                                        <div className="relative z-10 text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-edu-teal-100 mb-2">Institutional Allotment</p>
                                            <h4 className="text-2xl font-black font-outfit mb-4">{appData.application.allotment.campus}</h4>
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const res = await api.post('/admissions/confirm');
                                                        toast.success(res.data.message);
                                                        fetchStatus();
                                                    } catch (err: any) {
                                                        toast.error(err.response?.data?.message || 'Confirmation failed');
                                                    }
                                                }}
                                                className="w-full py-4 bg-white text-brand-deep rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-edu-teal hover:text-white transition-all shadow-lg"
                                            >
                                                Confirm Admission
                                            </button>
                                        </div>
                                        <MapPin className="absolute -bottom-6 -right-6 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                                    </motion.div>
                                )}
                            </div>

                            {(appData.status === 'ACCEPTED' || appData.status === 'REJECTED') && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleDownload('result')}
                                    className="w-full bg-tharqiya-gold dark:bg-tharqiya-gold text-white dark:text-slate-950 py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-tharqiya-gold/30 flex items-center justify-center gap-3 uppercase tracking-widest"
                                >
                                    <Download className="w-6 h-6" />
                                    Download Result PDF
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPortal;
