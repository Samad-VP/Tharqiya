import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Search, Filter, MoreVertical, Shield, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const AdminUsers: React.FC = () => {
    const [searchParams] = useSearchParams();
    const roleFilter = searchParams.get('role') || 'INTERVIEWER';
    const { user: currentUser, loading: authLoading } = useAuth();
    
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: roleFilter,
        phone: '',
        whatsapp: ''
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
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/users', formData);
            setShowAddModal(false);
            fetchUsers();
            setFormData({ name: '', email: '', password: '', role: roleFilter, phone: '', whatsapp: '' });
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="w-full">
                        <h2 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase leading-tight">
                            Manage <span className="text-edu-teal">{roleFilter}s</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Add, update or remove {roleFilter.toLowerCase()} accounts.</p>
                    </div>

                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-deep dark:bg-edu-coral text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} /> Add {roleFilter}
                    </button>
                </div>

                {/* Filters & Search */}
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
                                className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 sm:p-6">
                                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-edu-coral transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-edu-teal/20 to-blue-500/20 flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-slate-50 dark:ring-slate-800/50">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-edu-teal text-lg sm:text-xl">
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-black text-brand-deep dark:text-white font-outfit mb-1">{user.name}</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 sm:mb-6">
                                        <Shield size={12} className="text-edu-teal" /> {user.role}
                                    </div>

                                    <div className="w-full space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-50 dark:border-slate-800">
                                        <div className="flex items-center gap-3 text-slate-500 hover:text-brand-deep dark:hover:text-white transition-colors">
                                            <Mail size={16} className="shrink-0" />
                                            <span className="text-[10px] sm:text-xs font-bold truncate">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-3 text-slate-500 hover:text-brand-deep dark:hover:text-white transition-colors">
                                                <Phone size={16} className="shrink-0" />
                                                <span className="text-[10px] sm:text-xs font-bold">{user.phone}</span>
                                            </div>
                                        )}
                                        {user.whatsapp && (
                                            <div className="flex items-center gap-3 text-edu-teal transition-colors">
                                                <span className="w-4 h-4 rounded-full bg-edu-teal/20 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.602 6.04L0 24l6.105-1.602a11.832 11.832 0 005.94 1.586h.005c6.632 0 12.028-5.396 12.031-12.03a11.8 11.8 0 00-3.417-8.467z"/></svg>
                                                </span>
                                                <span className="text-[10px] sm:text-xs font-black tracking-tight">{user.whatsapp}</span>
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

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 overflow-y-auto">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                        className="fixed inset-0 bg-brand-deep/40 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden my-auto"
                    >
                        <div className="p-6 sm:p-10">
                            <h3 className="text-xl sm:text-2xl font-black text-brand-deep dark:text-white font-outfit mb-2 tracking-tight uppercase">Create <span className="text-edu-teal">Account</span></h3>
                            <p className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-widest mb-6 sm:mb-8">Set up a new {roleFilter.toLowerCase()} profile.</p>

                            <form onSubmit={handleCreateUser} className="space-y-4 sm:space-y-6">
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
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="w-full py-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors order-2 sm:order-1"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="w-full py-4 rounded-xl sm:rounded-2xl bg-edu-teal text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-edu-teal/20 hover:scale-[1.02] transition-all order-1 sm:order-2"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
