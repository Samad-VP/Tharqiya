import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await api.get('/admissions/my-notifications');
            const allNotifs = response.data.data;
            setNotifications(allNotifs.slice(0, 5)); // Only show top 5
            setUnreadCount(allNotifs.filter((n: any) => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh every 2 minutes
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            try {
                await api.patch('/admissions/notifications/read');
                setUnreadCount(0);
            } catch (error) {
                console.error('Failed to mark notifications as read:', error);
            }
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-edu-coral hover:text-white dark:hover:bg-edu-teal dark:hover:text-slate-900 transition-all duration-300 shadow-inner group"
                aria-label="Notifications"
            >
                <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-edu-coral text-[10px] font-bold text-white shadow-lg"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-[100] overflow-hidden"
                    >
                        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black font-outfit text-brand-deep dark:text-white uppercase tracking-tight">Recent Commmunications</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Official Updates</span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif, idx) => (
                                    <div 
                                        key={notif.id || idx}
                                        className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex gap-4">
                                            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'EMAIL' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {notif.type === 'EMAIL' ? <Mail size={18} /> : <MessageSquare size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-xs font-black font-outfit text-brand-deep dark:text-white uppercase truncate pr-2">
                                                        {notif.event.replace(/_/g, ' ')}
                                                    </h4>
                                                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                                                        {new Date(notif.sentAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                                                    {notif.message.replace(/<[^>]*>/g, ' ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent communications</p>
                                </div>
                            )}
                        </div>

                        {user.role === 'STUDENT' && (
                            <Link 
                                to="/student/portal?tab=notifications" 
                                onClick={() => setIsOpen(false)}
                                className="block p-4 bg-slate-50 dark:bg-white/5 text-center text-[10px] font-black text-edu-coral uppercase tracking-[0.2em] hover:bg-edu-coral hover:text-white transition-all"
                            >
                                View All Communication History
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
