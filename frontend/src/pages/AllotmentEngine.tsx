import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    CheckCircle2, 
    Send, 
    MapPin, 
    Loader2, 
    TrendingUp,
    Shield,
    Info,
    LayoutDashboard
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { COURSE_LEVELS } from '../utils/constants';

const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const AllotmentEngine: React.FC = () => {
    const { user } = useAuth();
    const isPrincipal = user?.role === 'PRINCIPAL';
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({}); // appId -> levelName

    const [campuses, setCampuses] = useState<any[]>([]);

    // Correction & Revocation States
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [correctionData, setCorrectionData] = useState({ campus: '', course: '', notify: true });
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        fetchEligibleCandidates();
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const response = await api.get('/campus');
            setCampuses(response.data.data);
        } catch (error) {
            console.error('Error fetching campuses:', error);
        }
    };

    const fetchEligibleCandidates = async () => {
        try {
            const response = await api.get('/allotments/eligible');
            const data = response.data.data;
            setCandidates(data);
            
            // Initialize selected levels from current allotment or default to level 1
            const initialLevels: Record<string, string> = {};
            data.forEach((can: any) => {
                initialLevels[can.id] = can.allotment?.course || COURSE_LEVELS[0]?.name || '';
            });
            setSelectedLevels(prev => ({ ...initialLevels, ...prev }));
        } catch (error) {
            toast.error('Failed to load eligible candidates');
        } finally {
            setLoading(false);
        }
    };

    const handlePropose = async (applicationId: string, campus: string) => {
        const candidate = candidates.find(c => c.id === applicationId);
        const courseName = selectedLevels[applicationId] || COURSE_LEVELS[0]?.name || '';
        const level = COURSE_LEVELS.find(l => l.name === courseName);
        const age = calculateAge(candidate?.student?.dob);

        if (level && age > level.maxAge) {
            const confirmed = window.confirm(`Age Limit Exceeded! \n\nApplicant Age: ${age} \nLevel Limit: ${level.maxAge} (${level.name}) \n\nProceed anyway?`);
            if (!confirmed) return;
        }

        try {
            await api.post('/allotments/propose', { applicationId, campus, course: courseName });
            toast.success(`Provisional allotment set to ${campus} (${courseName})`);
            fetchEligibleCandidates();
            fetchCampuses(); // Update stats
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to propose allotment');
        }
    };

    const handleFinalizeAll = async () => {
        const toFinalize = candidates
            .filter(c => c.allotment && !c.allotment.isFinalized)
            .map(c => c.id);

        if (toFinalize.length === 0) {
            toast.error('No provisional allotments to finalize');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/allotments/finalize', { applicationIds: toFinalize });
            toast.success('Allotments finalized and notifications sent!');
            fetchEligibleCandidates();
            fetchCampuses(); // Update stats
        } catch (error) {
            toast.error('Failed to finalize allotments');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevoke = async () => {
        if (!selectedCandidate) return;
        setProcessingAction(true);
        try {
            await api.post('/principal/revoke-allotment', { 
                allotmentId: selectedCandidate.allotment.id,
                reason: 'Correcting accidental allotment'
            });
            toast.success('Allotment revoked. Candidate reverted to evaluation pool.');
            setShowRevokeModal(false);
            fetchEligibleCandidates();
            fetchCampuses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to revoke allotment');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleUpdateAllotment = async () => {
        if (!selectedCandidate) return;
        setProcessingAction(true);
        try {
            await api.post('/principal/override-allotment', {
                allotmentId: selectedCandidate.allotment.id,
                newCampus: correctionData.campus,
                newCourse: correctionData.course,
                notifyStudent: correctionData.notify,
                reason: 'Administrative correction'
            });
            toast.success('Allotment updated successfully');
            setShowCorrectionModal(false);
            fetchEligibleCandidates();
            fetchCampuses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update allotment');
        } finally {
            setProcessingAction(false);
        }
    };

    const calculateAvgScore = (evaluations: any[]) => {
        if (!evaluations?.length) return 0;
        const total = evaluations.reduce((acc, curr) => acc + curr.marks, 0);
        return (total / evaluations.length).toFixed(1);
    };

    const getMarksBreakdown = (evaluations: any[]) => {
        const marks = { hifz: '—' as string | number, english: '—' as string | number, general: '—' as string | number };
        if (!evaluations) return marks;
        
        evaluations.forEach(ev => {
            const subject = ev.subject?.toUpperCase();
            if (subject === 'HIFZ') marks.hifz = ev.marks;
            else if (subject === 'ENGLISH' || subject === 'ENG') marks.english = ev.marks;
            else if (subject === 'GENERAL' || subject === 'GEN') marks.general = ev.marks;
        });
        return marks;
    };

    const handleRunBatchAllotment = async () => {
        if (!window.confirm('This will automatically allot seats to all evaluated candidates based on merit and available capacity. Proceed?')) return;
        
        setSubmitting(true);
        try {
            const response = await api.post('/admissions/generate-allotment');
            toast.success(response.data.message || 'Batch allotment completed successfully');
            fetchEligibleCandidates();
            fetchCampuses();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to run batch allotment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-tharqiya-deep dark:text-white uppercase leading-none">
                            Allotment <span className="text-edu-teal">Engine</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-3 ml-1">
                            Operational seat assignment and enrollment authorization
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleRunBatchAllotment}
                            disabled={submitting}
                            className="px-6 py-4 bg-tharqiya-gold text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-tharqiya-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={16} /> : <TrendingUp size={16} />}
                            Run Batch Allotment
                        </button>
                        {isPrincipal && (
                        <button 
                            onClick={handleFinalizeAll}
                            disabled={submitting}
                            className="px-8 py-4 bg-edu-coral text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-edu-coral/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            Finalize & Secure Enrollment
                        </button>
                        )}
                    </div>
                </div>

                {/* Campus Capacity Tracker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campuses.length > 0 ? campuses.map((campus, idx) => (
                        <motion.div 
                            key={campus.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight line-clamp-2 max-w-[80%]">{campus.name}</span>
                                <Info size={14} className="text-slate-200" />
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-3xl font-black text-tharqiya-deep dark:text-white font-outfit">{campus.occupied}</span>
                                <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase">/ {campus.maxSeats} Seats</span>
                            </div>
                            <div className="h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(campus.occupied / campus.maxSeats) * 100}%` }}
                                    className="h-full bg-edu-teal rounded-full"
                                />
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Campuses Tracked</p>
                        </div>
                    )}
                </div>

                {/* Candidate Roster Sections */}
                <div className="space-y-12">
                    {/* Section 1: Pending Allotments */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-500/5">
                            <h3 className="text-lg font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-amber-500" />
                                Pending Allotment
                            </h3>
                            <div className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                {candidates.filter(c => !c.allotment?.isFinalized).length} Awaiting Action
                            </div>
                        </div>
                        
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Candidate</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Score</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Levels</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Preferences</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Current Status</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <Loader2 className="w-10 h-10 text-edu-teal animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : candidates.filter(c => !c.allotment?.isFinalized).length > 0 ? candidates.filter(c => !c.allotment?.isFinalized).map((can, idx) => (
                                        <motion.tr 
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs border border-edu-teal/20">
                                                        {can.student?.user?.profileImageUrl ? (
                                                            <img src={can.student.user.profileImageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                                        ) : can.student?.user?.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tight">{can.student?.user?.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{can.student?.applicationNo}</p>
                                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                                                calculateAge(can.student?.dob) > (COURSE_LEVELS.find(l => l.name === (selectedLevels[can.id] || COURSE_LEVELS[0]?.name || ''))?.maxAge || 99)
                                                                ? 'bg-red-500/10 text-red-500'
                                                                : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                                                            }`}>
                                                                {calculateAge(can.student?.dob)} Yrs
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={14} className="text-edu-teal" />
                                                    <span className="font-black text-tharqiya-deep dark:text-white">{calculateAvgScore(can.interview?.evaluations)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <select 
                                                        disabled={can.allotment?.isFinalized}
                                                        value={selectedLevels[can.id] || COURSE_LEVELS[0]?.name || ''}
                                                        onChange={(e) => setSelectedLevels(prev => ({ ...prev, [can.id]: e.target.value }))}
                                                        className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-tharqiya-deep dark:text-white outline-none focus:border-edu-teal transition-all min-w-[140px] appearance-none cursor-pointer"
                                                    >
                                                        {COURSE_LEVELS.map(level => (
                                                            <option key={level.name} value={level.name} className="dark:bg-slate-800 dark:text-white">
                                                                {level.name} (L{level.level})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400"><span className="text-slate-300">#1</span> {can.student?.firstOption || 'None'}</p>
                                                    <p className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400"><span className="text-slate-300">#2</span> {can.student?.secondOption || 'None'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {can.allotment ? (
                                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit border bg-amber-500/10 text-amber-500 border-amber-500/20`}>
                                                        <MapPin size={12} /> {can.allotment.campus}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-slate-300 uppercase italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        disabled={!isPrincipal}
                                                        onClick={() => handlePropose(can.id, can.student?.firstOption || 'Campus A')}
                                                        className={`px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest transition-all border border-transparent ${isPrincipal ? 'hover:text-edu-teal hover:bg-edu-teal/5 hover:border-edu-teal/20' : 'opacity-50 cursor-not-allowed'}`}
                                                    >
                                                        Pref 1
                                                    </button>
                                                    <button 
                                                        disabled={!isPrincipal}
                                                        onClick={() => handlePropose(can.id, can.student?.secondOption || 'Campus B')}
                                                        className={`px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest transition-all border border-transparent ${isPrincipal ? 'hover:text-edu-coral hover:bg-edu-coral/5 hover:border-edu-coral/20' : 'opacity-50 cursor-not-allowed'}`}
                                                    >
                                                        Pref 2
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No candidates awaiting allotment</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 2: Confirmed Enrollments */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-500/5">
                            <h3 className="text-lg font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-emerald-500" />
                                Confirmed Enrollments
                            </h3>
                            <div className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                {candidates.filter(c => c.allotment?.isFinalized).length} Finalized
                            </div>
                        </div>
                        
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Candidate</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Score</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Levels</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Allotted Campus</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <Loader2 className="w-10 h-10 text-edu-teal animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : candidates.filter(c => c.allotment?.isFinalized).length > 0 ? candidates.filter(c => c.allotment?.isFinalized).map((can, idx) => (
                                        <motion.tr 
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-500 text-xs border border-emerald-500/20">
                                                        {can.student?.user?.profileImageUrl ? (
                                                            <img src={can.student.user.profileImageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                                        ) : can.student?.user?.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tight">{can.student?.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{can.student?.applicationNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={14} className="text-edu-teal" />
                                                    <span className="font-black text-tharqiya-deep dark:text-white">{calculateAvgScore(can.interview?.evaluations)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase">
                                                    {can.allotment?.course}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit border border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                                                    <MapPin size={12} /> {can.allotment?.campus}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                    can.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500' : 
                                                    can.status === 'ADMISSION_AUTHORIZED' ? 'bg-blue-500/10 text-blue-500' : 
                                                    'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {can.status === 'ACCEPTED' ? 'Enrolled' : 
                                                     can.status === 'ADMISSION_AUTHORIZED' ? 'Authorized' : 
                                                     'Allotted'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {isPrincipal ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedCandidate(can);
                                                                setCorrectionData({ 
                                                                    campus: can.allotment.campus, 
                                                                    course: can.allotment.course, 
                                                                    notify: true 
                                                                });
                                                                setShowCorrectionModal(true);
                                                            }}
                                                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-teal hover:bg-edu-teal/5 font-black text-[9px] uppercase tracking-widest transition-all"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedCandidate(can);
                                                                setShowRevokeModal(true);
                                                            }}
                                                            className="px-3 py-1.5 rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500/10 font-black text-[9px] uppercase tracking-widest transition-all"
                                                        >
                                                            Revoke
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                                        <Shield size={14} /> Finalized
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No finalized enrollments yet</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                    {/* Mobile Card View (Visible only on Mobile) */}
                    <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <div className="p-10 text-center">
                                <Loader2 className="w-10 h-10 text-edu-teal animate-spin mx-auto" />
                            </div>
                        ) : candidates.length > 0 ? candidates.map((can, idx) => (
                            <div key={idx} className="p-6 space-y-6">
                                {/* Candidate Header */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-base border border-edu-teal/20 shrink-0">
                                        {can.student?.user?.profileImageUrl ? (
                                            <img src={can.student.user.profileImageUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                                        ) : can.student?.user?.name?.[0]}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tight text-lg leading-none">{can.student?.user?.name}</p>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 text-edu-teal">
                                                    <TrendingUp size={14} />
                                                    <span className="font-black">{calculateAvgScore(can.interview?.evaluations)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {(() => {
                                                        const m = getMarksBreakdown(can.interview?.evaluations);
                                                        return (
                                                            <>
                                                                <span className="text-[7px] font-black text-emerald-500">H:{m.hifz}</span>
                                                                <span className="text-[7px] font-black text-blue-500">E:{m.english}</span>
                                                                <span className="text-[7px] font-black text-edu-coral">G:{m.general}</span>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{can.student?.applicationNo}</p>
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                                calculateAge(can.student?.dob) > (COURSE_LEVELS.find(l => l.name === (selectedLevels[can.id] || COURSE_LEVELS[0]?.name || ''))?.maxAge || 99)
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                                            }`}>
                                                {calculateAge(can.student?.dob)} Yrs
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences & Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Preferences</p>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300"><span className="text-slate-300">#1</span> {can.student?.firstOption || 'None'}</p>
                                            <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300"><span className="text-slate-300">#2</span> {can.student?.secondOption || 'None'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        {can.allotment ? (
                                            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight flex items-center justify-end gap-1.5 border ml-auto w-fit ${can.allotment.isFinalized ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                <MapPin size={10} /> {can.allotment.campus}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-black text-slate-300 uppercase italic mt-1">Unassigned</p>
                                        )}
                                    </div>
                                </div>

                                {/* Level Selection Dropdown */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Level</p>
                                    <select 
                                        disabled={can.allotment?.isFinalized}
                                        value={selectedLevels[can.id] || COURSE_LEVELS[0]?.name || ''}
                                        onChange={(e) => setSelectedLevels(prev => ({ ...prev, [can.id]: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-black uppercase text-tharqiya-deep dark:text-white outline-none focus:border-edu-teal transition-all appearance-none cursor-pointer"
                                    >
                                        {COURSE_LEVELS.map(level => (
                                            <option key={level.name} value={level.name}>
                                                {level.name} (L{level.level})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                {!can.allotment?.isFinalized ? (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button 
                                            disabled={!isPrincipal}
                                            onClick={() => handlePropose(can.id, can.student?.firstOption || 'Campus A')}
                                            className="py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all text-center"
                                        >
                                            Pref 1
                                        </button>
                                        <button 
                                            disabled={!isPrincipal}
                                            onClick={() => handlePropose(can.id, can.student?.secondOption || 'Campus B')}
                                            className="py-3 rounded-xl bg-edu-coral/10 text-edu-coral font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all text-center"
                                        >
                                            Pref 2
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <Shield size={14} /> Final Enrollment Secured
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="p-10 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No candidates available</p>
                            </div>
                        )}
                    </div>
            </div>

            {/* Correction Modal */}
            {showCorrectionModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter mb-2">Correct Allotment</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Updating details for {selectedCandidate?.student?.user?.name}</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">New Campus</label>
                                <select 
                                    value={correctionData.campus}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, campus: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-black uppercase text-tharqiya-deep dark:text-white outline-none focus:border-edu-teal transition-all"
                                >
                                    {campuses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">New Course Level</label>
                                <select 
                                    value={correctionData.course}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, course: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-black uppercase text-tharqiya-deep dark:text-white outline-none focus:border-edu-teal transition-all"
                                >
                                    {COURSE_LEVELS.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-edu-teal/5 rounded-2xl border border-edu-teal/10">
                                <input 
                                    type="checkbox" 
                                    id="notify"
                                    checked={correctionData.notify}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, notify: e.target.checked }))}
                                    className="w-4 h-4 rounded border-slate-300 text-edu-teal focus:ring-edu-teal cursor-pointer"
                                />
                                <label htmlFor="notify" className="text-[10px] font-black text-edu-teal uppercase tracking-widest cursor-pointer leading-tight">
                                    Notify Student (Send Correction Email)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setShowCorrectionModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={processingAction}
                                    onClick={handleUpdateAllotment}
                                    className="flex-1 py-4 rounded-2xl bg-edu-teal text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-edu-teal/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {processingAction && <Loader2 className="animate-spin" size={14} />}
                                    Update Allotment
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Revoke Modal */}
            {showRevokeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Shield size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-tharqiya-deep dark:text-white font-outfit uppercase tracking-tighter text-center mb-2">Withdraw Allotment?</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-8 px-4 leading-relaxed">
                            This will completely remove the allotment for <span className="text-tharqiya-deep dark:text-white">{selectedCandidate?.student?.user?.name}</span> and revert their status to evaluated.
                        </p>
                        
                        <div className="p-4 bg-amber-500/5 rounded-2xl mb-8 border border-amber-500/10">
                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-loose">
                                ⚠️ Note: A withdrawal notification will be sent to the student automatically.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowRevokeModal(false)}
                                className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Nevermind
                            </button>
                            <button 
                                disabled={processingAction}
                                onClick={handleRevoke}
                                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {processingAction && <Loader2 className="animate-spin" size={14} />}
                                Yes, Withdraw
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AllotmentEngine;
