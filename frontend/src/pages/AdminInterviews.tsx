import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Search, 
    Filter, 
    Download, 
    MoreHorizontal, 
    Clock, 
    MapPin, 
    UserCheck,
    Loader2,
    CalendarPlus,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminInterviews: React.FC = () => {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [interviewers, setInterviewers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApps, setSelectedApps] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'scheduled'>('pending');
    
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [schedulingData, setSchedulingData] = useState({
        interviewerId: '',
        scheduledAt: '',
        location: 'Darussalam Edu Village',
        sendNotifications: true,
        rescheduleReason: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appsRes, interviewsRes, interviewersRes] = await Promise.all([
                api.get('/admissions/all'),
                api.get('/interviews/all'),
                api.get('/auth/users?role=INTERVIEWER')
            ]);
            
            setApplications(appsRes.data.data);
            setInterviews(interviewsRes.data.data);
            setInterviewers(interviewersRes.data.data || []);
            setSelectedApps([]); // Clear selection after fetch
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load interview data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && currentUser) {
            fetchData();
        }
    }, [authLoading, currentUser]);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && editingId) {
                await api.patch(`/interviews/${editingId}`, schedulingData);
                toast.success(`Interview rescheduled successfully${schedulingData.sendNotifications ? ' with apology notification!' : '.'}`);
            } else {
                const response = await api.post('/interviews/batch-schedule', {
                    applicationIds: selectedApps,
                    ...schedulingData
                });
                
                const results = response.data.data;
                const successCount = results.filter((r: any) => r.status === 'success').length;
                const failureCount = results.filter((r: any) => r.status === 'error').length;

                if (failureCount === 0) {
                    toast.success(`${successCount} Interview boards setup successfully${schedulingData.sendNotifications ? ' with notifications!' : '.'}`);
                } else if (successCount > 0) {
                    toast.success(`${successCount} scheduled, ${failureCount} failed. Check for duplicate schedules.`);
                } else {
                    toast.error(`Batch scheduling failed. ${results[0]?.message || ''}`);
                }
            }
            setShowScheduleModal(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to process request');
        }
    };

    const openEditModal = (interview: any) => {
        setIsEditMode(true);
        setEditingId(interview.id);
        const date = new Date(interview.scheduledAt);
        // Format date for datetime-local input (YYYY-MM-DDThh:mm)
        const formattedDate = date.toISOString().slice(0, 16);
        
        setSchedulingData({
            interviewerId: interview.interviewerId,
            scheduledAt: formattedDate,
            location: interview.location,
            sendNotifications: true,
            rescheduleReason: ''
        });
        setShowScheduleModal(true);
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setSchedulingData({
            interviewerId: '',
            scheduledAt: '',
            location: 'Darussalam Edu Village',
            sendNotifications: true,
            rescheduleReason: ''
        });
        setShowScheduleModal(true);
    };

    const toggleAppSelection = (appId: string) => {
        setSelectedApps(prev => 
            prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
        );
    };

    const toggleAllPending = () => {
        if (selectedApps.length === pendingAssignment.length) {
            setSelectedApps([]);
        } else {
            setSelectedApps(pendingAssignment.map(app => app.id));
        }
    };

    const pendingAssignment = applications.filter(app => (app.status === 'ACCEPTED' || app.status === 'DOCS_VERIFIED') && !app.interview);

    return (
        <AdminLayout>
             <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                            Mass <span className="text-edu-teal">Interview</span> Setup
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest mt-1">Batch assign evaluation panels & trigger notifications</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {selectedApps.length > 0 && (
                            <motion.button 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={openCreateModal}
                                className="px-8 py-3 bg-tharqiya-deep dark:bg-edu-coral text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-coral/20 flex items-center gap-2 hover:-translate-y-1 transition-all"
                            >
                                <CalendarPlus size={18} /> Schedule {selectedApps.length} Candidates
                            </motion.button>
                        )}
                        
                        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-edu-teal text-white shadow-lg' : 'text-tharqiya-deep/60 dark:text-slate-500 hover:text-edu-teal'}`}
                            >
                                Pending Assignment ({pendingAssignment.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('scheduled')}
                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'scheduled' ? 'bg-edu-coral text-white shadow-lg' : 'text-tharqiya-deep/60 dark:text-slate-500 hover:text-edu-coral'}`}
                            >
                                Scheduled Boards ({interviews.length})
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/30 dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <Loader2 className="w-12 h-12 text-edu-teal animate-spin mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading Information...</p>
                    </div>
                ) : activeTab === 'pending' ? (
                    <div className="space-y-6">
                        {pendingAssignment.length > 0 && (
                            <div className="flex items-center gap-4 px-6 py-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-md">
                                <button 
                                    onClick={toggleAllPending}
                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-tharqiya-deep/60 dark:text-slate-500 hover:text-edu-teal transition-colors"
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedApps.length === pendingAssignment.length ? 'bg-edu-teal border-edu-teal text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                                        {selectedApps.length === pendingAssignment.length && <Check size={12} />}
                                    </div>
                                    {selectedApps.length === pendingAssignment.length ? 'Deselect All' : 'Select All Candidates'}
                                </button>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
                                <span className="text-[10px] font-bold text-tharqiya-deep/40 dark:text-slate-400 uppercase tracking-widest">{selectedApps.length} Selected for board assignment</span>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {pendingAssignment.length > 0 ? pendingAssignment.map((app, idx) => (
                                <motion.div 
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => toggleAppSelection(app.id)}
                                    className={`cursor-pointer p-6 rounded-[2.5rem] shadow-xl border-2 transition-all flex flex-col justify-between relative group overflow-hidden ${selectedApps.includes(app.id) ? 'bg-edu-teal/5 border-edu-teal ring-4 ring-edu-teal/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
                                >
                                    {selectedApps.includes(app.id) && (
                                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-edu-teal text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                                            <Check size={16} />
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${selectedApps.includes(app.id) ? 'bg-edu-teal text-white' : 'bg-edu-teal/10 text-edu-teal'}`}>
                                                {(app.student?.user?.name || app.student?.name)?.[0] || 'S'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-tharqiya-deep dark:text-white font-outfit text-base">{app.student?.user?.name || app.student?.name}</h4>
                                                <p className="text-[10px] font-black text-tharqiya-deep/40 dark:text-slate-400 uppercase tracking-widest">{app.student?.applicationNo}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800/50 space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-tharqiya-deep/50 dark:text-slate-500 uppercase tracking-widest">Hifz Center</span>
                                                <span className="text-tharqiya-deep dark:text-white">{app.student?.hifzCenter}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-tharqiya-deep/50 dark:text-slate-500 uppercase tracking-widest">District</span>
                                                <span className="text-tharqiya-deep dark:text-white uppercase">{app.student?.district}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className={`w-2 h-2 rounded-full ${selectedApps.includes(app.id) ? 'bg-edu-teal' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                        {selectedApps.includes(app.id) ? 'Ready for assignment' : 'Click to select'}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="lg:col-span-2 xl:col-span-3 py-20 text-center">
                                    <UserCheck className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter">Everything Sorted!</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">No candidates are currently waiting for board assignment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px]">Candidate</th>
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px]">Assigned Board</th>
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px]">Date & Time</th>
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px]">Location</th>
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px] text-center">Status</th>
                                        <th className="px-8 py-6 font-black text-tharqiya-deep/60 dark:text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                                    {interviews.length > 0 ? interviews.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs">
                                                        {(item.application?.student?.user?.name || item.application?.student?.name)?.[0] || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-tharqiya-deep dark:text-white font-outfit">{item.application?.student?.user?.name || item.application?.student?.name}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.application?.student?.applicationNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-edu-coral/10 flex items-center justify-center text-edu-coral">
                                                        <UserCheck size={14} />
                                                    </div>
                                                    <span className="font-black text-tharqiya-deep dark:text-white text-xs">{item.interviewer?.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-tharqiya-deep dark:text-white text-xs">{new Date(item.scheduledAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] font-bold text-tharqiya-deep/60 dark:text-slate-400">{new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-tharqiya-deep/60 dark:text-slate-500 font-bold text-xs">{item.location}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-3 py-1.5 rounded-full bg-edu-teal/10 text-edu-teal text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-edu-teal hover:bg-edu-teal/10 transition-all group"
                                                >
                                                    <MoreHorizontal size={18} className="group-hover:rotate-90 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <Calendar className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No scheduled boards yet</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
             </div>

            <AnimatePresence>
                {showScheduleModal && (isEditMode || selectedApps.length > 0) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowScheduleModal(false)}
                            className="absolute inset-0 bg-tharqiya-deep/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleSchedule} className="p-8 sm:p-10">
                                <h3 className="text-2xl font-black font-outfit text-tharqiya-deep dark:text-white mb-2 uppercase tracking-tight">
                                    {isEditMode ? 'Reschedule' : 'Setup Bulk'} <span className="text-edu-teal">Board</span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                                    {isEditMode ? 'Modify evaluation session' : `Scheduling ${selectedApps.length} candidates for evaluation`}
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Interviewer</label>
                                        <select 
                                            required
                                            value={schedulingData.interviewerId}
                                            onChange={e => setSchedulingData({...schedulingData, interviewerId: e.target.value})}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal rounded-2xl outline-none font-bold text-sm"
                                        >
                                            <option value="">Choose an interviewer</option>
                                            {interviewers.map(int => (
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
                                    <div className="pt-4">
                                        <label className="flex items-center gap-3 p-4 rounded-2xl bg-edu-teal/5 border border-edu-teal/20 cursor-pointer group hover:bg-edu-teal/10 transition-all">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="peer sr-only"
                                                    checked={schedulingData.sendNotifications}
                                                    onChange={e => setSchedulingData({...schedulingData, sendNotifications: e.target.checked})}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-edu-teal"></div>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-black text-tharqiya-deep dark:text-white uppercase tracking-widest">Send {isEditMode ? 'Apology' : ''} Notifications</span>
                                                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Trigger immediate WhatsApp & Email alerts</span>
                                            </div>
                                        </label>
                                    </div>

                                    {isEditMode && schedulingData.sendNotifications && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="pt-4"
                                        >
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reason for Rescheduling</label>
                                            <textarea 
                                                required={isEditMode && schedulingData.sendNotifications}
                                                value={schedulingData.rescheduleReason}
                                                onChange={e => setSchedulingData({...schedulingData, rescheduleReason: e.target.value})}
                                                placeholder="e.g. Unavailability of interviewer"
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal rounded-2xl outline-none font-bold text-sm min-h-[100px] resize-none"
                                            />
                                        </motion.div>
                                    )}
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
                                        {isEditMode ? 'Update Schedule' : 'Setup Board'}
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

export default AdminInterviews;
