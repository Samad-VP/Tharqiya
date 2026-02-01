import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Edit, Trash2, X, Loader2, AlertTriangle, Camera, GraduationCap, Building2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminFaculty: React.FC = () => {
    const [faculties, setFaculties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        category: 'ISLAMIC',
        department: '',
        photoUrl: '',
        photoPublicId: '',
        oldPublicId: '',
        order: 0
    });

    const categories = ['ISLAMIC', 'GENERAL'];
    
    const departmentsByType: Record<string, string[]> = {
        ISLAMIC: ['Quran', 'Hadith', 'Fiqh', 'Aqeedah', 'Arabic Language', 'Islamic History', 'Suluk'],
        GENERAL: ['Science', 'Commerce', 'Humanities', 'Mathematics', 'English', 'IT', 'Sociology']
    };

    const positions = ['Principal', 'Vice Principal', 'Dean', 'Professor', 'Assistant Professor', 'Lecturer', 'Guest Faculty', 'Tutor'];

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            setLoading(true);
            const response = await api.get('/faculty');
            setFaculties(response.data.data || []);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            toast.error('Failed to fetch faculty list');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setFormData({ 
            name: '', 
            position: '', 
            category: 'ISLAMIC', 
            department: '', 
            photoUrl: '', 
            photoPublicId: '',
            oldPublicId: '',
            order: 0
        });
        setShowModal(true);
    };

    const handleOpenEdit = (faculty: any) => {
        setModalMode('edit');
        setSelectedFaculty(faculty);
        setFormData({
            name: faculty.name,
            position: faculty.position,
            category: faculty.category,
            department: faculty.department,
            photoUrl: faculty.photoUrl || '',
            photoPublicId: faculty.photoPublicId || '',
            oldPublicId: faculty.photoPublicId || '',
            order: faculty.order || 0
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
            const response = await api.post('/faculty/upload-photo', data);
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
                await api.post('/faculty', formData);
                toast.success('Faculty member added');
            } else {
                await api.patch(`/faculty/${selectedFaculty.id}`, formData);
                toast.success('Faculty member updated');
            }
            setShowModal(false);
            fetchFaculties();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/faculty/${id}`);
            toast.success('Faculty member removed');
            setShowDeleteConfirm(null);
            fetchFaculties();
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
                            Faculty <span className="text-edu-teal">Management</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Maintain institutional academic excellence</p>
                    </div>

                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-deep dark:bg-edu-coral text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} /> Add Faculty
                    </button>
                </div>

                {/* Faculty List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-80 rounded-[2.5rem] bg-white dark:bg-slate-900 animate-pulse border border-slate-100 dark:border-slate-800" />
                        ))
                    ) : faculties.length > 0 ? (
                        faculties.map((f, idx) => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                    <div className="mr-2 px-3 py-1 bg-edu-teal text-white rounded-lg text-[10px] font-black uppercase flex items-center h-fit">Pos: {f.order || 0}</div>
                                    <button onClick={() => handleOpenEdit(f)} className="p-2 rounded-xl bg-slate-100 text-brand-deep hover:bg-edu-teal hover:text-white transition-all"><Edit size={16} /></button>
                                    <button onClick={() => setShowDeleteConfirm(f.id)} className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500">
                                        {f.photoUrl ? (
                                            <img src={f.photoUrl} alt={f.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-black text-slate-300 flex items-center justify-center h-full">{f.name?.[0] || 'F'}</span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-1">{f.name}</h3>
                                    <p className="text-[10px] font-black text-edu-teal uppercase tracking-widest mb-4">{f.position}</p>

                                    <div className="w-full pt-6 border-t border-slate-50 dark:border-slate-800 space-y-3 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-edu-teal/10 rounded-lg text-edu-teal"><Building2 size={14} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{f.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-edu-coral/10 rounded-lg text-edu-coral"><GraduationCap size={14} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Academic Track</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{f.category} STUDIES</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No faculty members found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-brand-deep/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden p-8 sm:p-12">
                            <h3 className="text-2xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter mb-8">
                                {modalMode === 'create' ? 'Add New' : 'Edit'} <span className="text-edu-teal">Faculty</span>
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Photo Upload */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative group/photo">
                                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
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
                                        <label className="absolute -bottom-2 -right-2 p-3 bg-edu-teal text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                            <Camera size={16} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Member Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="Full Name" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Order</label>
                                        <input required type="number" min="0" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-center text-brand-deep dark:text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                        <select value={formData.category} onChange={e => {
                                            const cat = e.target.value;
                                            setFormData({...formData, category: cat, department: (departmentsByType[cat] && departmentsByType[cat][0]) || ''});
                                        }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-xs uppercase tracking-widest leading-tight text-brand-deep dark:text-white">
                                            {categories.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
                                        <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-xs uppercase tracking-widest leading-tight text-brand-deep dark:text-white">
                                            {(departmentsByType[formData.category] || []).map(d => <option key={d} value={d} className="bg-white dark:bg-slate-900">{d}</option>)}
                                            <option value="Other" className="bg-white dark:bg-slate-900">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.department === 'Other' && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type Custom Department</label>
                                        <input required type="text" onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="e.g., Philosophy" />
                                    </motion.div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Position</label>
                                    <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-xs uppercase tracking-widest leading-tight text-brand-deep dark:text-white">
                                        <option value="" className="bg-white dark:bg-slate-900">Select Position</option>
                                        {positions.map(p => <option key={p} value={p} className="bg-white dark:bg-slate-900">{p}</option>)}
                                        <option value="Other" className="bg-white dark:bg-slate-900">Other</option>
                                    </select>
                                </div>

                                {formData.position === 'Other' && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type Custom Position</label>
                                        <input required type="text" onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-none focus:ring-4 focus:ring-edu-teal/10 font-bold text-sm text-brand-deep dark:text-white" placeholder="e.g., Coordinator" />
                                    </motion.div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Discard</button>
                                    <button type="submit" disabled={uploading} className="flex-1 py-5 rounded-2xl bg-brand-deep text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                                        {modalMode === 'create' ? 'Add Member' : 'Update Member'}
                                    </button>
                                </div>
                            </form>
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
                            <p className="text-xs text-slate-500 font-bold mb-8">This will permanently remove the faculty member from the registry.</p>
                            <div className="space-y-3">
                                <button onClick={() => handleDelete(showDeleteConfirm)} className="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20">Remove Permanently</button>
                                <button onClick={() => setShowDeleteConfirm(null)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminFaculty;
