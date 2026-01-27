import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    CheckCircle2, 
    Send, 
    MapPin, 
    Loader2, 
    TrendingUp,
    Shield
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AllotmentEngine: React.FC = () => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEligibleCandidates();
    }, []);

    const fetchEligibleCandidates = async () => {
        try {
            const response = await api.get('/allotments/eligible');
            setCandidates(response.data.data);
        } catch (error) {
            toast.error('Failed to load eligible candidates');
        } finally {
            setLoading(false);
        }
    };

    const handlePropose = async (applicationId: string, campus: string) => {
        try {
            await api.post('/allotments/propose', { applicationId, campus });
            toast.success(`Provisional allotment set to ${campus}`);
            fetchEligibleCandidates();
        } catch (error) {
            toast.error('Failed to propose allotment');
        }
    };

    const handleFinalizeAll = async () => {
        const toFinalize = candidates
            .filter(c => c.allotment && c.allotment.status === 'PROVISIONAL')
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
        } catch (error) {
            toast.error('Failed to finalize allotments');
        } finally {
            setSubmitting(false);
        }
    };

    const calculateAvgScore = (evaluations: any[]) => {
        if (!evaluations?.length) return 0;
        const total = evaluations.reduce((acc, curr) => acc + curr.marks, 0);
        return (total / evaluations.length).toFixed(1);
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-brand-deep dark:text-white uppercase">
                            Allotment <span className="text-edu-teal">Engine</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 ml-1">
                            Assign candidates to campuses based on preferences and merit
                        </p>
                    </div>
                    <button 
                        onClick={handleFinalizeAll}
                        disabled={submitting}
                        className="px-8 py-4 bg-edu-coral text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-coral/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Finalize & Notify All
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Candidate</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Score</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Preferences</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Current Allotment</th>
                                    <th className="px-8 py-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <Loader2 className="w-10 h-10 text-edu-teal animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : candidates.length > 0 ? candidates.map((can, idx) => (
                                    <motion.tr 
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-edu-teal/10 flex items-center justify-center font-black text-edu-teal text-xs">
                                                    {can.student?.user?.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-deep dark:text-white font-outfit">{can.student?.user?.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{can.student?.applicationNo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-edu-teal" />
                                                <span className="font-black text-brand-deep dark:text-white">{calculateAvgScore(can.interview?.evaluations)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] font-black"><span className="text-slate-400">1.</span> {can.student?.firstOption || 'None'}</p>
                                                <p className="text-[10px] font-black"><span className="text-slate-400">2.</span> {can.student?.secondOption || 'None'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {can.allotment ? (
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${can.allotment.status === 'FINALIZED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    <MapPin size={12} /> {can.allotment.campus}
                                                    {can.allotment.status === 'FINALIZED' && <CheckCircle2 size={12} />}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-300 uppercase italic">Not Proposed</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {can.allotment?.status !== 'FINALIZED' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handlePropose(can.id, can.student?.firstOption || 'Campus A')}
                                                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-teal font-black text-[10px] uppercase transition-all"
                                                        >
                                                            Allot Preference 1
                                                        </button>
                                                        <button 
                                                            onClick={() => handlePropose(can.id, can.student?.secondOption || 'Campus B')}
                                                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-coral font-black text-[10px] uppercase transition-all"
                                                        >
                                                            Allot Preference 2
                                                        </button>
                                                    </>
                                                )}
                                                {can.allotment?.status === 'FINALIZED' && (
                                                    <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase">
                                                        <Shield size={14} /> Enrollment Confirmed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No candidates eligible for allotment</p>
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

export default AllotmentEngine;
