import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Shield, Mail, Phone, Edit, Trash2, X, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import FileUploader from '../components/common/FileUploader';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
    const [searchParams] = useSearchParams();
    const roleFilter = searchParams.get('role') || 'INTERVIEWER';
    const { user: currentUser, loading: authLoading } = useAuth();
    
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: roleFilter,
        phone: '',
        whatsapp: '',
        profileImageUrl: '',
        profileImagePublicId: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleFilter }));
        if (!authLoading && currentUser) {
            fetchUsers();
        }
    }, [roleFilter, authLoading, currentUser]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/auth/users?role=${roleFilter}`);
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setFormData({ name: '', email: '', password: '', role: roleFilter, phone: '', whatsapp: '', profileImageUrl: '', profileImagePublicId: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (user: any) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Keep empty unless changing
            role: user.role,
            phone: user.phone || '',
            whatsapp: user.whatsapp || '',
            profileImageUrl: user.profileImageUrl || '',
            profileImagePublicId: user.profileImagePublicId || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await api.post('/auth/users', formData);
                toast.success('User created successfully');
            } else {
                await api.put(`/auth/users/${selectedUser.id}`, formData);
                toast.success('User updated successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/auth/users/${id}`);
            toast.success('User deleted successfully');
            setShowDeleteConfirm(null);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="w-full">
                        <h2 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                            Manage <span className="text-edu-teal">{roleFilter}s</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Add, update or remove {roleFilter.toLowerCase()} accounts.</p>
                    </div>

                    <button 
                        onClick={handleOpenCreate}
                        className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-tharqiya-deep dark:bg-edu-coral text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-tharqiya-deep/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} /> Add {roleFilter}
                    </button>
                </div>

                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow relative">
                        <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={`Search ${roleFilter.toLowerCase()}s...`}
                            className="w-full pl-14 sm:pl-16 pr-6 py-4 rounded-xl sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-edu-teal transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-[2rem] sm:rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 animate-pulse border border-slate-100 dark:border-slate-800" />
                        ))
                    ) : users.length > 0 ? (
                        users.map((user, idx) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all relative group overflow-hidden flex flex-col"
                            >
                                <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button 
                                        onClick={() => handleOpenEdit(user)}
                                        className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-tharqiya-deep dark:text-edu-teal hover:bg-edu-teal hover:text-white transition-all shadow-sm"
                                        title="Edit User"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(user.id)}
                                        className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                        title="Delete User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center flex-grow">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-edu-teal/20 to-blue-500/20 flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-slate-50 dark:ring-slate-800/50">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-edu-teal text-lg sm:text-xl">
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-black text-tharqiya-deep dark:text-white font-outfit mb-1">{user.name}</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 sm:mb-6">
                                        <Shield size={12} className="text-edu-teal" /> {user.role}
                                    </div>

                                    <div className="w-full space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-50 dark:border-slate-800 text-left">
                                        <div className="flex items-center gap-3 text-slate-500 group-hover/card:text-tharqiya-deep dark:group-hover/card:text-white transition-colors">
                                            <Mail size={16} className="shrink-0 text-edu-teal" />
                                            <span className="text-[10px] sm:text-xs font-bold truncate">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-3 text-slate-500 transition-colors">
                                                <Phone size={16} className="shrink-0 text-edu-teal" />
                                                <span className="text-[10px] sm:text-xs font-bold">{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 sm:py-20 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">No {roleFilter.toLowerCase()}s found matching search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Unified for Add/Edit */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-tharqiya-deep/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden my-auto"
                        >
                            <div className="p-6 sm:p-10">
                                <h3 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit mb-2 tracking-tight uppercase">
                                    {modalMode === 'create' ? 'Create' : 'Edit'} <span className="text-edu-teal">Account</span>
                                </h3>
                                <p className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-widest mb-6 sm:mb-8">
                                    {modalMode === 'create' ? `Set up a new ${roleFilter.toLowerCase()} profile.` : `Updating ${selectedUser?.name}'s details.`}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                            placeholder="email@tharqiya.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone</label>
                                            <input 
                                                type="text" 
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                                placeholder="Mobile"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-edu-teal">WhatsApp</label>
                                            <input 
                                                type="text" 
                                                value={formData.whatsapp}
                                                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                                                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-edu-teal/30 focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                                placeholder="WhatsApp"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Profile Photo</label>
                                        <FileUploader
                                            onUploadSuccess={(url, publicId) => setFormData({ ...formData, profileImageUrl: url, profileImagePublicId: publicId })}
                                            onRemove={() => setFormData({ ...formData, profileImageUrl: '', profileImagePublicId: '' })}
                                            label="Upload Profile Photo"
                                            type="image"
                                            currentPublicId={formData.profileImagePublicId}
                                            docType="profile_images"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password {modalMode === 'edit' && '(Leave blank to keep current)'}</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                required={modalMode === 'create'}
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-edu-teal transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button 
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors order-2 sm:order-1"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="w-full py-4 rounded-xl sm:rounded-2xl bg-edu-teal text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-teal/20 hover:scale-[1.02] transition-all order-1 sm:order-2"
                                        >
                                            {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteConfirm(null)}
                            className="fixed inset-0 bg-tharqiya-deep/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-3xl text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-600">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-tharqiya-deep dark:text-white font-outfit mb-2">Are you sure?</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-bold mb-8">This action is permanent and will completely remove the interviewer account.</p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Delete Permanently
                                </button>
                                <button 
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminUsers;
