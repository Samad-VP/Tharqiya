import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Edit, Trash2, X, Loader2, AlertTriangle, Camera, GraduationCap, MapPin, Briefcase, School, Building2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminAlumni: React.FC = () => {
    const [alumnis, setAlumnis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        place: '',
        status: 'WORKING', // WORKING or STUDYING
        institution: '',
        university: '',
        position: '',
        organization: '',
        photoUrl: '',
        photoPublicId: '',
        oldPublicId: '',
        order: 0
    });

    useEffect(() => {
        fetchAlumnis();
    }, []);

    const fetchAlumnis = async () => {
        try {
            setLoading(true);
            const response = await api.get('/alumni');
            setAlumnis(response.data.data || []);
        } catch (error) {
            console.error('Error fetching alumni:', error);
            toast.error('Failed to fetch alumni list');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setFormData({ 
            name: '', 
            place: '', 
            status: 'WORKING', 
            institution: '', 
            university: '', 
            position: '', 
            organization: '',
            photoUrl: '', 
            photoPublicId: '',
            oldPublicId: '',
            order: 0
        });
        setShowModal(true);
    };

    const handleOpenEdit = (alumni: any) => {
        setModalMode('edit');
        setSelectedAlumni(alumni);
        setFormData({
            name: alumni.name,
            place: alumni.place,
            status: alumni.status,
            institution: alumni.institution || '',
            university: alumni.university || '',
            position: alumni.position || '',
            organization: alumni.organization || '',
            photoUrl: alumni.photoUrl || '',
            photoPublicId: alumni.photoPublicId || '',
            oldPublicId: alumni.photoPublicId || '',
            order: alumni.order || 0
        });
        setShowModal(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 300 * 1024) {
            toast.error('File size must be less than 300KB');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const response = await api.post('/alumni/upload-photo', data);
            setFormData(prev => ({ 
                ...prev, 
                photoUrl: response.data.data.url, 
                photoPublicId: response.data.data.public_id 
            }));
            toast.success('Photo uploaded successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await api.post('/alumni', formData);
                toast.success('Alumni added successfully');
            } else {
                await api.patch(`/alumni/${selectedAlumni.id}`, formData);
                toast.success('Alumni updated successfully');
            }
            setShowModal(false);
            fetchAlumnis();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/alumni/${id}`);
            toast.success('Alumni record deleted');
            setShowDeleteConfirm(null);
            fetchAlumnis();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                            Alumni <span className="text-edu-coral">Registry</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Tracing scholarly contributions & success</p>
                    </div>

                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-deep dark:bg-edu-teal text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} /> Add Alumni
                    </button>
                </div>

                {/* Alumni List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-80 rounded-[2.5rem] bg-white dark:bg-slate-900 animate-pulse border border-slate-100 dark:border-slate-800" />
                        ))
                    ) : alumnis.length > 0 ? (
                        alumnis.map((a, idx) => (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                    <div className="mr-2 px-3 py-1 bg-edu-coral text-white rounded-lg text-[10px] font-black uppercase flex items-center h-fit">Pos: {a.order || 0}</div>
                                    <button onClick={() => handleOpenEdit(a)} className="p-2 rounded-xl bg-slate-100 text-brand-deep hover:bg-edu-coral hover:text-white transition-all"><Edit size={16} /></button>
                                    <button onClick={() => setShowDeleteConfirm(a.id)} className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden mb-6 group-hover:scale-110 transition-transform duration-700">
                                        {a.photoUrl ? (
                                            <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-black text-slate-200 flex items-center justify-center h-full">{a.name?.[0] || 'A'}</span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-1">{a.name}</h3>
                                    <div className="flex items-center gap-2 justify-center text-slate-400 mb-6">
                                        <MapPin size={10} className="text-edu-coral" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{a.place}</p>
                                    </div>

                                    <div className="w-full pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4 text-left">
                                        {a.status === 'WORKING' ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-edu-teal/10 rounded-lg text-edu-teal"><Briefcase size={14} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Position</p>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{a.position}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-edu-coral/10 rounded-lg text-edu-coral"><Building2 size={14} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Organization</p>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{a.organization}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-edu-yellow/10 rounded-lg text-edu-yellow"><School size={14} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Institution</p>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{a.institution}</p>
                                                    </div>
                                                </div>
                                                {a.university && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-edu-teal/10 rounded-lg text-edu-teal"><GraduationCap size={14} /></div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">University</p>
                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{a.university}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Empty</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-brand-deep/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden">
                            <div className="p-8 sm:p-12 max-h-[90vh] overflow-y-auto">
                                <h3 className="text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-4">
                                    {modalMode === 'create' ? 'Register' : 'Edit'} <span className="text-edu-coral">Alumni</span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Add professional or academic records for graduates.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Photo Upload */}
                                    <div className="flex justify-center mb-10">
                                        <div className="relative group/photo">
                                            <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                                                {formData.photoUrl ? (
                                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera size={24} className="text-slate-300" />
                                                )}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                        <Loader2 className="animate-spin text-edu-teal" />
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 p-3 bg-brand-deep text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                                <Camera size={16} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="Full Name" />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Order</label>
                                            <input required type="number" min="0" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-center text-brand-deep dark:text-white" />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Residence</label>
                                            <input required type="text" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="City / Country" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 text-center sm:text-left">Current Status</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <button type="button" onClick={() => setFormData({...formData, status: 'WORKING'})} className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.status === 'WORKING' ? 'bg-edu-teal text-white shadow-lg shadow-edu-teal/20' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'}`}>
                                                Professional (Working)
                                            </button>
                                            <button type="button" onClick={() => setFormData({...formData, status: 'STUDYING'})} className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.status === 'STUDYING' ? 'bg-edu-coral text-white shadow-lg shadow-edu-coral/20' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'}`}>
                                                Scholarly (Studying)
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {formData.status === 'WORKING' ? (
                                            <motion.div key="working" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Position</label>
                                                    <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="e.g., Imam, Manager" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Organization</label>
                                                    <input required type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="Masjid, Company, etc." />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="studying" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Institution</label>
                                                    <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-coral/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="Current School/College" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">University (Optional)</label>
                                                    <input type="text" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-4 focus:ring-edu-coral/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="University affiliation" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest">Discard</button>
                                        <button type="submit" className="flex-1 py-5 rounded-2xl bg-brand-deep text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all">Finish Registration</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirm */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(null)} className="fixed inset-0 bg-brand-deep/90 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center">
                            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div>
                            <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit mb-2 uppercase tracking-tighter">Are you sure?</h3>
                            <p className="text-xs text-slate-500 font-bold mb-8">This will delete the alumni record forever.</p>
                            <div className="space-y-3">
                                <button onClick={() => handleDelete(showDeleteConfirm)} className="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Delete Registry Entry</button>
                                <button onClick={() => setShowDeleteConfirm(null)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Keep Record</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminAlumni;
