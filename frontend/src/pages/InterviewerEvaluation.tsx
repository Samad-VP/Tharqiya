import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, 
    User, 
    BookOpen, 
    Star, 
    MessageSquare, 
    Save, 
    Loader2,
    CheckCircle2,
    AlertCircle,
    BrainCircuit,
    Languages
} from 'lucide-react';
import InterviewerLayout from '../components/InterviewerLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const InterviewerEvaluation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [standards, setStandards] = useState<any>(null);

    const [marks, setMarks] = useState({
        Hifz: '',
        English: '',
        General: ''
    });

    const [remarks, setRemarks] = useState({
        Hifz: '',
        English: '',
        General: ''
    });

    const [completedSubjects, setCompletedSubjects] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [intRes, settingsRes] = await Promise.all([
                    api.get('/interviews/assigned'), // Get all and find specific one
                    api.get('/settings')
                ]);

                const foundInterview = intRes.data.data.find((i: any) => i.id === id);
                if (!foundInterview) {
                    toast.error('Interview assignment not found');
                    navigate('/interviewer');
                    return;
                }

                setInterview(foundInterview);
                setStandards(settingsRes.data.data);

                // Pre-fill existing evaluations
                if (foundInterview.evaluations) {
                    const newMarks = { ...marks };
                    const newRemarks = { ...remarks };
                    const completed: string[] = [];

                    foundInterview.evaluations.forEach((evalItem: any) => {
                        if (evalItem.subject in newMarks) {
                            (newMarks as any)[evalItem.subject] = evalItem.marks.toString();
                            (newRemarks as any)[evalItem.subject] = evalItem.remarks || '';
                            completed.push(evalItem.subject);
                        }
                    });

                    setMarks(newMarks);
                    setRemarks(newRemarks);
                    setCompletedSubjects(completed);
                }

            } catch (error) {
                console.error('Error fetching interview:', error);
                toast.error('Failed to load interview details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, navigate]);

    const handleMarkChange = (subject: string, value: string) => {
        const val = parseInt(value);
        if (value !== '' && (isNaN(val) || val < 0 || val > 100)) return;
        setMarks(prev => ({ ...prev, [subject]: value }));
    };

    const handleSubmit = async (subject: string) => {
        if (!marks[subject as keyof typeof marks]) {
            toast.error(`Please enter marks for ${subject}`);
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/evaluations/submit', {
                interviewId: id,
                subject,
                marks: marks[subject as keyof typeof marks],
                remarks: remarks[subject as keyof typeof remarks]
            });

            toast.success(`${subject} evaluation submitted!`);
            setCompletedSubjects(prev => [...new Set([...prev, subject])]);
            
            // If all done, maybe redirect? Or just stay
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to submit ${subject} evaluation`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <InterviewerLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-tharqiya-orange animate-spin mb-4" />
                    <p className="text-xs font-black text-tharqiya-deep/40 dark:text-slate-400 uppercase tracking-widest">Accessing Board Files...</p>
                </div>
            </InterviewerLayout>
        );
    }

    const subjects = ['Hifz', 'English', 'General'];

    return (
        <InterviewerLayout>
            <div className="space-y-8 pb-20">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <Link to="/interviewer" className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tharqiya-orange shadow-sm hover:shadow-md transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tighter leading-none">
                            Candidate <span className="text-tharqiya-orange">Evaluation</span>
                        </h2>
                        <p className="text-[10px] font-bold text-tharqiya-deep/60 dark:text-slate-400 uppercase tracking-widest mt-2 px-1">Institutional Assessment Protocol</p>
                    </div>
                </div>

                {/* Candidate Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-gradient-to-br from-tharqiya-deep to-slate-900 text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <User size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-4xl border border-white/20 overflow-hidden shrink-0">
                                {interview?.application?.student?.user?.profileImageUrl ? (
                                    <img 
                                        src={interview.application.student.user.profileImageUrl} 
                                        alt="Candidate" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (interview?.application?.student?.user?.name || interview?.application?.student?.name)?.[0]
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">{interview?.application?.student?.user?.name || interview?.application?.student?.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">App ID: {interview?.application?.student?.applicationNo}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-tharqiya-orange/20 text-tharqiya-orange px-3 py-1 rounded-full border border-tharqiya-orange/20">{interview?.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Session Timing</p>
                            <p className="text-xl font-black font-outfit italic text-tharqiya-gold">
                                {new Date(interview?.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Evaluation Forms */}
                <div className="grid grid-cols-1 gap-8">
                    {subjects.map((subject, idx) => {
                        const isCompleted = completedSubjects.includes(subject);
                        const passMark = standards?.[`PASS_MARK_${subject.toUpperCase()}`] || 0;
                        const currentMark = parseInt(marks[subject as keyof typeof marks] || '0');
                        const isPassing = currentMark >= passMark;

                        // Subject Icons Mapping
                        const getSubjectIcon = (subj: string) => {
                            switch(subj) {
                                case 'Hifz': return <BookOpen size={28} />;
                                case 'English': return <Languages size={28} />;
                                case 'General': return <BrainCircuit size={28} />;
                                default: return <BookOpen size={28} />;
                            }
                        };
                        
                        // Subject Color Mapping
                        const getSubjectColor = (subj: string) => {
                           switch(subj) {
                               case 'Hifz': return 'text-emerald-500 bg-emerald-500/10';
                               case 'English': return 'text-blue-500 bg-blue-500/10';
                               case 'General': return 'text-tharqiya-orange bg-tharqiya-orange/10';
                               default: return 'text-tharqiya-deep/60 bg-slate-500/10';
                           }
                        };

                        return (
                            <motion.div 
                                key={subject}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border shadow-xl relative overflow-hidden transition-all ${isCompleted ? 'border-emerald-500/30' : 'border-slate-100 dark:border-slate-800'}`}
                            >
                                {isCompleted && (
                                    <div className="absolute top-0 right-0 p-8 text-emerald-500 opacity-10">
                                        <CheckCircle2 size={100} />
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                    <div className="shrink-0">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : getSubjectColor(subject)}`}>
                                            {getSubjectIcon(subject)}
                                        </div>
                                    </div>

                                    <div className="flex-grow space-y-8 w-full">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h4 className="text-2xl font-black font-outfit text-tharqiya-deep dark:text-white uppercase tracking-tighter">{subject} Evaluation</h4>
                                                <p className="text-[10px] font-bold text-tharqiya-deep/60 dark:text-slate-400 uppercase tracking-widest mt-1">Passing Grade: {passMark}%</p>
                                            </div>
                                            {isCompleted && (
                                                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                                                    <CheckCircle2 size={14} /> Recorded
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-tharqiya-deep/80 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Star size={12} className="text-tharqiya-gold" /> Marks Obtained (0-100)
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        value={marks[subject as keyof typeof marks]}
                                                        onChange={(e) => handleMarkChange(subject, e.target.value)}
                                                        disabled={submitting}
                                                        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-black text-xl text-tharqiya-deep dark:text-white outline-none transition-all ${isCompleted ? 'border-emerald-500/20 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-700 focus:border-tharqiya-orange focus:ring-4 focus:ring-tharqiya-orange/10'}`}
                                                        placeholder="00"
                                                    />
                                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-tharqiya-deep/20">/ 100</span>
                                                </div>
                                                {marks[subject as keyof typeof marks] !== '' && (
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isPassing ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {isPassing ? 'Qualifying Mark' : 'Below PASS Level'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-tharqiya-deep/80 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <MessageSquare size={12} /> Scholarly Remarks / Observations
                                                </label>
                                                <textarea 
                                                    rows={1}
                                                    value={remarks[subject as keyof typeof remarks]}
                                                    onChange={(e) => setRemarks(prev => ({ ...prev, [subject]: e.target.value }))}
                                                    disabled={submitting}
                                                    className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl font-bold text-sm outline-none transition-all resize-none ${isCompleted ? 'border-emerald-500/20 bg-emerald-50/10 text-tharqiya-deep/60' : 'border-slate-200 dark:border-slate-700 focus:border-tharqiya-orange focus:ring-4 focus:ring-tharqiya-orange/10 text-tharqiya-deep dark:text-white'}`}
                                                    placeholder="Enter your professional assessment here..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSubmit(subject)}
                                                disabled={submitting}
                                                className={`px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-3 ${isCompleted ? 'bg-white dark:bg-slate-900 text-tharqiya-deep dark:text-white border border-tharqiya-deep/20 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800' : 'bg-tharqiya-orange text-white hover:bg-tharqiya-deep shadow-tharqiya-orange/20 hover:shadow-tharqiya-orange/40 hover:-translate-y-1'}`}
                                            >
                                                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                {isCompleted ? 'Update Record' : `Commit ${subject} Grade`}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Final Completion Status */}
                {completedSubjects.length === subjects.length && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[2.5rem] bg-tharqiya-deep text-white shadow-2xl flex flex-col items-center text-center space-y-4 border border-white/10"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase font-outfit tracking-tight text-white">Assessment Completed</h3>
                            <p className="text-sm font-medium opacity-80 max-w-md mx-auto text-white">All evaluations for this candidate have been successfully recorded in the institutional registry. No further action is required.</p>
                        </div>
                        <Link to="/interviewer" className="px-10 py-4 bg-tharqiya-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-tharqiya-gold hover:text-tharqiya-deep transition-all shadow-xl shadow-black/20 hover:-translate-y-1">
                            Return to Dashboard
                        </Link>
                    </motion.div>
                )}

                {/* Warning for uncompleted assessment */}
                {completedSubjects.length < subjects.length && completedSubjects.length > 0 && (
                    <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex items-center gap-4 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="shrink-0" />
                        <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                            Interim Session: {subjects.length - completedSubjects.length} subjects remaining for complete evaluation.
                        </p>
                    </div>
                )}
            </div>
        </InterviewerLayout>
    );
};

export default InterviewerEvaluation;
