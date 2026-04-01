import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Timer, FolderOpen, CheckSquare, ShieldAlert, ShieldCheck, Download, Bell, AlertCircle, MapPin, CalendarCheck, BookOpen, User, TrendingUp, FileText, Camera, GraduationCap, ArrowRight, Fingerprint, FileCheck, ScanEye, Hourglass } from 'lucide-react';
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
        id: string;
        status: string;
        appliedAt: string;
        interview?: {
            scheduledAt: string;
            location: string;
            interviewer?: {
                user: {
                    name: string;
                    email: string;
                    phone: string;
                    profileImageUrl?: string;
                }
            }
        },
        allotment?: {
            campus: string;
            course: string;
            isFinalized: boolean;
        };
    };
    resources?: any;
    user?: {
        profileImageUrl: string;
    };
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
            case 'ACCEPTED': return { icon: <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            case 'REJECTED': return { icon: <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'ALLOTTED': 
            case 'ADMISSION_AUTHORIZED': return { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-edu-teal', bg: 'bg-edu-teal/10' };
            case 'PENDING': return { icon: <Timer className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            case 'DOCS_VERIFIED': return { icon: <FileCheck className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
            case 'REVIEWED': return { icon: <ScanEye className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-purple-500', bg: 'bg-purple-500/10' };
            case 'EVALUATED': return { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
            case 'ALLOTMENT_READY': return { icon: <Hourglass className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-orange-500', bg: 'bg-orange-500/10' };
            case 'INTERVIEW_SCHEDULED': return { icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
            default: return { icon: <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DOCS_VERIFIED': return 'Documents Verified';
            case 'INTERVIEW_SCHEDULED': return 'Interview Scheduled';
            case 'EVALUATED': return 'In Selection Pipeline';
            case 'ALLOTMENT_READY': return 'Awaiting Allotment';
            case 'ADMISSION_AUTHORIZED': return 'Admission Authorized';
            default: return status.replace(/_/g, ' ');
        }
    };

    if (authLoading || (loading && user)) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-edu-coral border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-[10px]">Awaiting Journey Details...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 p-6">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black font-outfit text-tharqiya-deep dark:text-white mb-2 tracking-tight uppercase">Retrieval Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center max-w-sm text-sm">{error}</p>
            <button onClick={fetchStatus} className="btn-primary px-8">Try Again</button>
        </div>
    );

    const statusStyle = appData ? getStatusStyles(appData.application.status || appData.status) : null;

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12 pb-10">
            {/* Hero Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-6 sm:p-10 lg:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12 text-center md:text-left">
                    <Link to="/student/profile" className="relative group shrink-0">
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center shadow-2xl overflow-hidden p-2.5 sm:p-4 border-4 border-slate-50 dark:border-slate-800 transition-all duration-500 group-hover:shadow-edu-coral/20"
                        >
                            <div className="w-full h-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center relative">
                                {appData?.user?.profileImageUrl ? (
                                    <img src={appData.user.profileImageUrl} alt="Student" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600" />
                                )}
                                
                                <div className="absolute inset-0 bg-edu-coral/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white scale-75 group-hover:scale-100 transition-transform duration-500" />
                                </div>
                            </div>
                        </motion.div>
                        {/* Status Pulse */}
                        <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-md animate-pulse" />
                    </Link>

                    <div className="flex-grow space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="h-premium-lg text-tharqiya-deep dark:text-white mt-4">
                                <span className="font-amiri text-lg sm:text-3xl lg:text-4xl mb-1 block">السَّلَامُ عَلَيْكُمْ<span className="text-edu-coral ml-1">،</span></span>
                                <span className="text-gold-orange">{user?.name}</span>
                            </h1>
                        </motion.div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
                            <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-xl text-premium-xs border border-slate-200 dark:border-slate-700 shadow-sm">
                                <Fingerprint size={14} className="text-edu-yellow" /> Candidate ID: {user?.id.slice(0, 8)}
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 bg-edu-coral/10 text-edu-coral rounded-xl text-premium-xs border border-edu-coral/20 shadow-sm">
                                <GraduationCap size={14} /> Batch 2026
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-edu-teal/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-edu-coral/10 blur-[120px] rounded-full animate-pulse" />
            </motion.div>

            {!appData ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-12 sm:p-24 lg:p-32 text-center rounded-[3rem] bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 backdrop-blur-xl"
                >
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"
                    >
                        <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600" />
                    </motion.div>
                    <h2 className="text-3xl sm:text-5xl font-black text-tharqiya-deep dark:text-white mb-6 tracking-tight font-outfit uppercase">Begin Your Scholarly Path</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-12 font-medium text-sm sm:text-base leading-relaxed">
                        Join the Tharqiya Course at Darussalam Edu Village. Initiate your application now for the 2026 academic batch.
                    </p>
                    <Link to="/admission">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-edu-coral text-white h-14 sm:h-16 px-10 sm:px-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm shadow-2xl shadow-edu-coral/30 hover:shadow-edu-coral/50 transition-all font-outfit"
                        >
                            Initiate Application
                        </motion.button>
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-8 lg:space-y-12">
                    {/* Stat Cards Grid */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                    >
                        {[
                            { 
                                label: 'Portal Status', 
                                value: getStatusLabel(appData.application.status || appData.status), 
                                icon: statusStyle?.icon, 
                                color: statusStyle?.color, 
                                bg: statusStyle?.bg 
                            },
                            { 
                                label: 'Application ID', 
                                value: appData.applicationNo, 
                                icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, 
                                color: 'text-edu-teal', 
                                bg: 'bg-edu-teal/10' 
                            },
                            { 
                                label: 'Candidate Origin', 
                                value: appData.place, 
                                icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />, 
                                color: 'text-edu-coral', 
                                bg: 'bg-edu-coral/10' 
                            },
                            { 
                                label: 'Admission Batch', 
                                value: '2026', 
                                icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />, 
                                color: 'text-edu-yellow', 
                                bg: 'bg-edu-yellow/10' 
                            }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-start mb-5 sm:mb-6">
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        {stat.icon}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <h3 className={`h-premium-md ${stat.color} truncate mb-1.5`}>{stat.value}</h3>
                                <p className="text-premium-xs text-slate-400 dark:text-slate-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 space-y-8 lg:space-y-12">
                            {/* Application Dossier */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 sm:p-10 lg:p-12 rounded-[2.5rem] lg:rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-edu-teal via-edu-coral to-edu-yellow" />
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 lg:mb-12">
                                    <div>
                                        <h3 className="h-premium-md text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border leading-none">Application Dossier</h3>
                                        <p className="text-premium-xs text-slate-400 mt-3">Comprehensive Candidate Verification</p>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDownload('application')} 
                                        className="w-full sm:w-auto h-12 sm:h-14 px-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest text-tharqiya-deep dark:text-white hover:bg-edu-teal hover:text-white hover:border-edu-teal transition-all shadow-sm"
                                    >
                                        <Download size={18} /> Download Dossier
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 sm:gap-y-10">
                                    {[
                                        { label: 'Hifz Institution', value: appData.hifzCenter, icon: BookOpen },
                                        { label: 'Guardian / Father', value: appData.fatherName, icon: User },
                                        { label: 'Submission Date', value: new Date(appData.application.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), icon: CalendarCheck },
                                        { label: 'Home District', value: appData.district, icon: MapPin },
                                        { label: 'Postal Address', value: appData.address, full: true, icon: FileText },
                                    ].map((row, i) => (
                                        <div key={i} className={`p-5 sm:p-0 rounded-2xl bg-slate-50 sm:bg-transparent dark:bg-slate-800/50 sm:dark:bg-transparent border border-slate-100 sm:border-0 dark:border-slate-800 sm:dark:border-0 ${row.full ? 'col-span-full' : ''}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <row.icon size={14} className="text-edu-teal opacity-50" />
                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{row.label}</span>
                                            </div>
                                            <span className="font-bold text-base sm:text-xl text-tharqiya-deep dark:text-slate-200 block sm:pl-7 leading-snug">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Interview Details */}
                            {appData.application.interview && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-6 sm:p-10 lg:p-12 rounded-[2.5rem] lg:rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                                            <CalendarCheck size={28} />
                                        </div>
                                        <h3 className="text-2xl sm:text-4xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit tracking-tighter uppercase leading-none">Evaluation Center</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Scheduled Date & Time</p>
                                                <p className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-slate-200 group-hover:text-blue-500 transition-colors">
                                                    {new Date(appData.application.interview.scheduledAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Venue</p>
                                                <p className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-slate-200 group-hover:text-blue-500 transition-colors">{appData.application.interview.location}</p>
                                            </div>
                                        </div>
                                        {appData.application.interview.interviewer && (
                                            <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-500/10 via-white dark:via-slate-900 to-blue-500/10 rounded-[2.5rem] border border-blue-500/20 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-inner group">
                                                <motion.div 
                                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30 overflow-hidden"
                                                >
                                                    {appData.application.interview.interviewer.user.profileImageUrl ? (
                                                        <img 
                                                            src={appData.application.interview.interviewer.user.profileImageUrl} 
                                                            alt={appData.application.interview.interviewer.user.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={32} />
                                                    )}
                                                </motion.div>
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">Assigned Evaluator</p>
                                                <h4 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit mb-3 leading-tight uppercase">{appData.application.interview.interviewer.user.name}</h4>
                                                <p className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 italic opacity-80">{appData.application.interview.interviewer.user.email}</p>
                                                
                                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Admission & Fee section */}
                            {['ALLOTTED', 'ADMISSION_AUTHORIZED', 'ACCEPTED'].includes(appData.application.status) && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-edu-teal/10 via-white dark:via-slate-900 to-edu-teal/10 border border-edu-teal/20 shadow-xl relative overflow-hidden group"
                                >
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-edu-teal text-white flex items-center justify-center shadow-lg shadow-edu-teal/20 group-hover:rotate-6 transition-transform duration-500">
                                                <ShieldCheck size={32} />
                                            </div>
                                            <div>
                                                <span className="px-3 py-1 bg-edu-teal/10 text-edu-teal rounded-full text-[9px] font-black uppercase tracking-widest border border-edu-teal/20">
                                                    {appData.application.status === 'ACCEPTED' ? 'Admission Confirmed' : 'Allotment Released'}
                                                </span>
                                                <h3 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white bg-none bg-clip-border font-outfit tracking-tighter mt-2 leading-none uppercase">
                                                    {appData.application.status === 'ACCEPTED' ? 'Dossier Finalized' : 'Your Campus Selection'}
                                                </h3>
                                                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-3 max-w-xl leading-relaxed">
                                                    {appData.application.allotment ? (
                                                        <>You have been allotted to <span className="text-tharqiya-deep dark:text-white font-black decoration-edu-teal underline decoration-2 underline-offset-4">{appData.application.allotment.campus}</span> campus.</>
                                                    ) : (
                                                        <>Please complete your enrollment process to view final allotment details.</>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Link to="/student/allotment">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full sm:w-auto px-8 h-14 bg-tharqiya-deep dark:bg-edu-teal text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all font-outfit flex items-center justify-center gap-3"
                                            >
                                                View Allotment <ArrowRight size={18} />
                                            </motion.button>
                                        </Link>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-edu-teal/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <aside className="lg:col-span-4 space-y-8 lg:space-y-12">
                            {/* Benchmarking */}
                            {standards && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative group"
                                >
                                    <div className="flex items-center justify-between mb-8 sm:mb-10">
                                        <h4 className="text-xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit tracking-tighter uppercase whitespace-nowrap">Academic <span className="text-edu-yellow">Standards</span></h4>
                                        <TrendingUp size={24} className="text-edu-yellow group-hover:scale-125 transition-transform" />
                                    </div>
                                    <div className="space-y-5">
                                        {[
                                            { label: 'Hifz Proficiency', value: standards.PASS_MARK_HIFZ, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                            { label: 'English Lang', value: standards.PASS_MARK_ENGLISH, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                            { label: 'General Knowledge', value: standards.PASS_MARK_GENERAL, color: 'text-edu-coral', bg: 'bg-edu-coral/10' }
                                        ].map((s, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ x: 5 }}
                                                className="p-5 rounded-2xl bg-tharqiya-cream/50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm"
                                            >
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{s.label}</p>
                                                <div className="flex items-end gap-2">
                                                    <p className={`text-4xl font-black ${s.color} font-outfit leading-none`}>{s.value}%</p>
                                                    <span className="text-[10px] font-bold text-slate-400 mb-1">Target</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <CheckSquare size={12} /> Minimum To Qualify
                                    </div>
                                    
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-edu-yellow/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            )}

                            {/* Quick Resources */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl relative group"
                            >
                                <h4 className="text-xl font-black text-tharqiya-deep dark:text-slate-100 bg-none bg-clip-border font-outfit tracking-tighter uppercase mb-10">Vanguard Resources</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Scholars Guide', icon: BookOpen, color: 'text-edu-coral', bg: 'bg-edu-coral/10' },
                                        { label: 'Academic Syllabus', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                        { label: 'Campus Protocol', icon: ShieldAlert, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                                    ].map((res, i) => (
                                        <Link key={i} to="/student/resources">
                                            <motion.div 
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-edu-teal transition-all group/res mb-4"
                                            >
                                                <div className={`p-3 rounded-xl ${res.bg} ${res.color} group-hover/res:bg-edu-teal group-hover/res:text-white transition-colors duration-500 shadow-sm`}>
                                                    <res.icon size={22} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="text-xs font-black uppercase text-tharqiya-deep dark:text-slate-200 tracking-widest block truncate">{res.label}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Available to view</span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                                <Link to="/student/resources" className="mt-6 flex items-center justify-center gap-2 text-[11px] font-black text-edu-teal uppercase tracking-widest hover:gap-4 transition-all pb-2">
                                    View All Resources <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        </aside>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortal;
