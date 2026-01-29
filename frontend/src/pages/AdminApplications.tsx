import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Download, 
    MoreHorizontal,
    Eye,
    CheckCircle2,
    XCircle,
    Loader2,
    Check,
    X,
    UserCircle,
    Calendar,
    Users,
    FolderOpen,
    Mail,
    MessageSquare,
    Bell
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminApplications: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [applications, setApplications] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedApplication, setSelectedApplication] = React.useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [showScheduleModal, setShowScheduleModal] = React.useState(false);
    const [interviewers, setInterviewers] = React.useState<any[]>([]);
    const [schedulingData, setSchedulingData] = React.useState({
        interviewerId: '',
        scheduledAt: '',
        location: 'Darussalam Edu Village'
    });
    const [selectedStudentNotifications, setSelectedStudentNotifications] = React.useState<any[]>([]);
    const [loadingNotifications, setLoadingNotifications] = React.useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admissions/all');
            setApplications(response.data.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchInterviewers = async () => {
        try {
            const response = await api.get('/auth/users?role=INTERVIEWER');
            setInterviewers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching interviewers:', error);
        }
    };

    React.useEffect(() => {
        if (!authLoading && currentUser) {
            fetchApplications();
            fetchInterviewers();
        }
    }, [authLoading, currentUser]);

    const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
        try {
            await api.patch(`/admissions/${applicationId}/status`, { status: newStatus });
            toast.success(`Application ${newStatus.toLowerCase()} successfully`);
            fetchApplications();
            setShowDetailsModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleScheduleInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/interviews/schedule', {
                applicationId: selectedApplication.id,
                ...schedulingData
            });
            toast.success('Interview scheduled successfully');
            setShowScheduleModal(false);
            fetchApplications();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
        }
    };

    const fetchStudentNotifications = async (userId: string) => {
        try {
            setLoadingNotifications(true);
            const response = await api.get(`/admin/notifications?userId=${userId}`);
            setSelectedStudentNotifications(response.data.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const formatLogMessage = (message: string) => {
        try {
            const parsed = JSON.parse(message);
            if (typeof parsed === 'object') {
                return Object.entries(parsed)
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ');
            }
        } catch (e) {
            return message.replace(/<[^>]*>/g, ' ').substring(0, 100);
        }
        return message;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
            case 'ACCEPTED': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'REJECTED': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
            case 'INTERVIEW_SCHEDULED': return 'bg-edu-teal/10 text-edu-teal';
            case 'DOCS_VERIFIED': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'ALLOTMENT_READY': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
            case 'ALLOTTED': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400';
            case 'ADMISSION_AUTHORIZED': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <AdminLayout>
             <div className="space-y-6 sm:space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="w-full">
                        <h2 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                            Application <span className="text-edu-teal">Management</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage and track candidate submissions</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search candidates..."
                                className="w-full pl-11 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-edu-teal/10 focus:border-edu-teal transition-all outline-none font-bold text-xs sm:text-sm dark:text-white shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="flex-grow sm:flex-none p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-edu-teal transition-all shadow-sm flex items-center justify-center">
                                <Filter size={18} />
                                <span className="sm:hidden ml-2 text-xs font-bold uppercase tracking-widest">Filter</span>
                            </button>
                            <button className="flex-grow sm:flex-none p-3 rounded-xl sm:rounded-2xl bg-edu-coral text-white shadow-lg shadow-edu-coral/20 hover:-translate-y-1 transition-all flex items-center justify-center">
                                <Download size={18} />
                                <span className="sm:hidden ml-2 text-xs font-bold uppercase tracking-widest">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Card View (Visible only on mobile) */}
                <div className="block lg:hidden space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-edu-teal animate-spin" />
                        </div>
                    ) : applications.length > 0 ? applications.map((app, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs">
                                        {(app.student?.user?.name || app.student?.name)?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-brand-deep dark:text-white font-outfit text-sm">{app.student?.user?.name || app.student?.name}</h4>
                                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{app.student?.applicationNo}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${getStatusColor(app.status)}`}>
                                    {app.status.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800/50 mb-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Applied Date</p>
                                    <p className="text-xs font-black text-brand-deep dark:text-white">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`text-[10px] font-black text-brand-deep dark:text-white`}>{app.status}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => { setSelectedApplication(app); setShowDetailsModal(true); }}
                                    className="flex-grow py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-edu-teal/10 hover:text-edu-teal transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> View Details
                                </button>
                                <button 
                                    disabled={!!app.interview}
                                    onClick={() => { setSelectedApplication(app); setShowScheduleModal(true); }}
                                    className={`p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 transition-all ${app.interview ? 'text-emerald-500 cursor-default' : 'text-slate-600 dark:text-slate-400 hover:text-edu-coral'}`}
                                    title={app.interview ? 'Interview already scheduled' : 'Schedule Interview'}
                                >
                                    {app.interview ? <CheckCircle2 size={18} /> : <Calendar size={18} />}
                                </button>
                                <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-brand-deep dark:hover:text-white transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No applications found</p>
                        </div>
                    )}
                </div>

                {/* Desktop Applications Table (Hidden on mobile) */}
                <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">ID</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Candidate</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Applied Date</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Avg Score</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex justify-center">
                                                <Loader2 className="w-10 h-10 text-edu-teal animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : applications.length > 0 ? applications.map((app, idx) => (
                                    <motion.tr 
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6 font-bold text-brand-deep dark:text-white tracking-widest text-[11px]">{app.student?.applicationNo}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    onClick={() => { setSelectedApplication(app); setShowDetailsModal(true); }}
                                                    className="w-10 h-10 rounded-full bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs cursor-pointer hover:scale-110 transition-transform"
                                                >
                                                    {(app.student?.user?.name || app.student?.name)?.[0] || 'S'}
                                                </div>
                                                <button 
                                                    onClick={() => { setSelectedApplication(app); setShowDetailsModal(true); }}
                                                    className="font-black text-brand-deep dark:text-white font-outfit hover:text-edu-teal transition-colors"
                                                >
                                                    {app.student?.user?.name || app.student?.name}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 font-bold text-[13px]">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-edu-teal" style={{ width: `0%` }} />
                                                </div>
                                                <span className="font-black text-brand-deep dark:text-white">N/A</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase ${getStatusColor(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                    onClick={() => { 
                                        setSelectedApplication(app); 
                                        setShowDetailsModal(true); 
                                        if (app.student?.userId) fetchStudentNotifications(app.student.userId);
                                    }}
                                    className="p-1 px-2 hover:bg-edu-teal/10 rounded-lg text-edu-teal transition-all group-hover:scale-110"
                                >
                                    <Eye size={16} />
                                </button>
                                                <button 
                                                    disabled={!!app.interview}
                                                    onClick={() => { setSelectedApplication(app); setShowScheduleModal(true); }}
                                                    className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 transition-all ${app.interview ? 'text-emerald-500 cursor-default' : 'text-slate-400 hover:text-edu-coral'}`}
                                                    title={app.interview ? 'Interview already scheduled' : 'Schedule Interview'}
                                                >
                                                    {app.interview ? <CheckCircle2 size={18} /> : <Calendar size={18} />}
                                                </button>
                                                <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-brand-deep dark:hover:text-white transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No applications found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50/30 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {applications.length} entry{applications.length !== 1 ? 's' : ''}</p>
                         <div className="flex gap-2">
                               <button className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">Pre</button>
                               <button className="px-4 py-2 rounded-xl bg-edu-coral text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-edu-coral/10 hover:-translate-y-0.5 transition-all">Next</button>
                         </div>
                    </div>
                </div>

                {/* Mobile Pagination Placeholder */}
                <div className="lg:hidden flex justify-center pt-4">
                    <button className="w-full py-4 rounded-xl bg-brand-deep text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl">Load More Applications</button>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedApplication && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { setShowDetailsModal(false); setSelectedStudentNotifications([]); }}
                            className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-2xl">
                                            {(selectedApplication.student?.user?.name || selectedApplication.student?.name)?.[0] || 'S'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black font-outfit text-brand-deep dark:text-white">{selectedApplication.student?.user?.name || selectedApplication.student?.name}</h3>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{selectedApplication.student?.applicationNo}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedApplication.status)}`}>
                                        {selectedApplication.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Academic Profile</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Hifz Center</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.hifzCenter}</span>
                                                </div>
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Dawras</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.dawrasCount}</span>
                                                </div>
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Schooling</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.schoolEducation}</span>
                                                </div>
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Kitabs Studied</span>
                                                    <span className="text-[10px] font-black truncate max-w-[150px]">{selectedApplication.student?.kitabsStudied || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Preferences</p>
                                            <div className="space-y-3">
                                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Options Selected</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[selectedApplication.student?.firstOption, selectedApplication.student?.secondOption, selectedApplication.student?.thirdOption].map((opt, i) => opt && (
                                                            <span key={i} className="px-2 py-1 bg-edu-teal/10 text-edu-teal rounded-lg text-[10px] font-black">{opt}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Guardian Info</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Father</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.fatherName}</span>
                                                </div>
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Mother</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.motherName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Personal Details</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">DOB</span>
                                                    <span className="text-[10px] font-black">{new Date(selectedApplication.student?.dob).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</span>
                                                    <span className="text-[10px] font-black">{selectedApplication.student?.whatsapp}</span>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                                                    <span className="block text-[8px] font-bold text-slate-500 uppercase mb-1">Address</span>
                                                    <span className="text-[10px] font-black leading-tight italic">{selectedApplication.student?.address}, {selectedApplication.student?.place}, {selectedApplication.student?.district}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* New Documents Section */}
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Documents & Identity</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedApplication.student?.documents?.photo ? (
                                                    <div className="relative group rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
                                                        <img 
                                                            src={selectedApplication.student.documents.photo} 
                                                            alt="Applicant" 
                                                            className="w-full h-24 object-cover"
                                                        />
                                                        <div className="absolute inset-x-0 bottom-0 bg-brand-deep/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <a href={selectedApplication.student.documents.photo} target="_blank" rel="noreferrer" className="text-[8px] font-black text-white uppercase tracking-widest block text-center">View Photo</a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-24 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800">
                                                        <UserCircle className="w-6 h-6 text-slate-300" />
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">No Photo</span>
                                                    </div>
                                                )}

                                                {selectedApplication.student?.documents?.certificate ? (
                                                    <a 
                                                        href={selectedApplication.student.documents.certificate} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="flex flex-col items-center justify-center h-24 rounded-xl bg-edu-teal/5 border border-edu-teal/20 hover:bg-edu-teal/10 transition-colors"
                                                    >
                                                        <Download className="w-6 h-6 text-edu-teal" />
                                                        <span className="text-[8px] font-black text-edu-teal uppercase tracking-widest mt-2">View Certificate</span>
                                                    </a>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-24 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800">
                                                        <FolderOpen className="w-6 h-6 text-slate-300" />
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">No Documents</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Communication History Section */}
                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Communication History</p>
                                        <button 
                                            onClick={() => selectedApplication.student?.userId && fetchStudentNotifications(selectedApplication.student.userId)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-edu-teal transition-all"
                                            title="Refresh Communications"
                                        >
                                            <Loader2 size={12} className={loadingNotifications ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {loadingNotifications ? (
                                            <div className="flex justify-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                                <Loader2 className="w-6 h-6 text-edu-teal animate-spin" />
                                            </div>
                                        ) : selectedStudentNotifications.length > 0 ? (
                                            <div className="grid gap-3">
                                                {selectedStudentNotifications.map((notif, i) => (
                                                    <div key={notif.id || i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-xl ${notif.type === 'EMAIL' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                                {notif.type === 'EMAIL' ? <Mail size={14} /> : <MessageSquare size={14} />}
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="text-[10px] font-black text-brand-deep dark:text-white uppercase tracking-tight leading-none">{notif.event.replace(/_/g, ' ')}</p>
                                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded">{notif.type}</span>
                                                                </div>
                                                                <p className="text-[9px] font-bold text-slate-400 truncate max-w-[200px]" title={notif.message.replace(/<[^>]*>/g, '')}>{formatLogMessage(notif.message)}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <p className="text-[8px] font-bold text-slate-400">{new Date(notif.sentAt).toLocaleString()}</p>
                                                                    {notif.senderEmail && (
                                                                        <span className="text-[8px] text-edu-teal font-bold truncate max-w-[120px]" title={notif.senderEmail}>• {notif.senderEmail}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right flex flex-col items-end">
                                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${notif.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                    {notif.status}
                                                                </span>
                                                                <span className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Source: {notif.triggeredBy}</span>
                                                            </div>
                                                            
                                                            {/* Only Admins can retry */}
                                                            {selectedApplication.student?.user?.role !== 'PRINCIPAL' && (
                                                                <button 
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        const loadToast = toast.loading("Resending...");
                                                                        try {
                                                                            await api.post(`/admin/notifications/${notif.id}/retry`);
                                                                            toast.success("Sent!", { id: loadToast });
                                                                            if (selectedApplication.student?.userId) fetchStudentNotifications(selectedApplication.student.userId);
                                                                        } catch (err: any) {
                                                                            toast.error(err.response?.data?.message || "Failed", { id: loadToast });
                                                                        }
                                                                    }}
                                                                    className="p-1.5 hover:bg-edu-teal text-edu-teal hover:text-white rounded-lg transition-all"
                                                                    title="Manual Resend"
                                                                >
                                                                    <Bell size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-bold text-slate-400 uppercase text-center py-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">No communication recorded yet</p>
                                        )}
                                    </div>
                                </div>

                                
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex gap-2 flex-grow">
                                        {selectedApplication.status === 'PENDING' && (
                                            <button 
                                                onClick={() => {
                                                    api.patch(`/admissions/${selectedApplication.id}/verify-docs`, { isVerified: true })
                                                        .then(() => {
                                                            toast.success('Documents verified successfully');
                                                            fetchApplications();
                                                            setShowDetailsModal(false);
                                                        })
                                                        .catch(err => toast.error('Failed to verify documents'));
                                                }}
                                                className="flex-grow py-4 rounded-2xl bg-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={18} /> Verify Documents
                                            </button>
                                        )}
                                        {['DOCS_VERIFIED', 'REVIEWED', 'EVALUATED', 'ALLOTMENT_READY'].includes(selectedApplication.status) && (
                                           <button 
                                                onClick={() => handleStatusUpdate(selectedApplication.id, 'ACCEPTED')}
                                                className="flex-grow py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} /> Approve Admission
                                            </button> 
                                        )}
                                        
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedApplication.id, 'REJECTED')}
                                            className="flex-grow py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setShowDetailsModal(false)}
                                        className="sm:w-32 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors border border-slate-200 dark:border-slate-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Schedule Modal */}
            <AnimatePresence>
                {showScheduleModal && selectedApplication && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowScheduleModal(false)}
                            className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleScheduleInterview} className="p-8 sm:p-10">
                                <h3 className="text-2xl font-black font-outfit text-brand-deep dark:text-white mb-2 uppercase tracking-tight">Schedule <span className="text-edu-teal">Interview</span></h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Scheduling interview for {selectedApplication.student?.user?.name || selectedApplication.student?.name}</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Interviewer</label>
                                        <select 
                                            required
                                            value={schedulingData.interviewerId}
                                            onChange={e => setSchedulingData({...schedulingData, interviewerId: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal rounded-2xl outline-none font-bold text-sm"
                                        >
                                            <option value="">Select an interviewer</option>
                                            {interviewers.filter(int => int.interviewer).map(int => (
                                                <option key={int.id} value={int.interviewer?.id}>{int.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date & Time</label>
                                        <input 
                                            type="datetime-local" 
                                            required
                                            value={schedulingData.scheduledAt}
                                            onChange={e => setSchedulingData({...schedulingData, scheduledAt: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal rounded-2xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={schedulingData.location}
                                            onChange={e => setSchedulingData({...schedulingData, location: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal rounded-2xl outline-none font-bold text-sm"
                                            placeholder="Location"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-10">
                                    <button 
                                        type="button"
                                        onClick={() => setShowScheduleModal(false)}
                                        className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-edu-teal text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-teal/20 hover:scale-[1.02] transition-all"
                                    >
                                        Confirm Schedule
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminApplications;
