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
        role: roleFilter
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
            setFormData({ name: '', email: '', password: '', role: roleFilter });
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
                                            {user.name[0].toUpperCase()}
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
                                        <div className="flex items-center gap-3 text-slate-500 hover:text-brand-deep dark:hover:text-white transition-colors">
                                            <Phone size={16} className="shrink-0" />
                                            <span className="text-[10px] sm:text-xs font-bold">{user.phone || 'No phone'}</span>
                                        </div>
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
                                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm"
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
                                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm"
                                        placeholder="email@tharqiya.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-edu-teal focus:ring-4 focus:ring-edu-teal/10 transition-all font-bold text-xs sm:text-sm"
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
