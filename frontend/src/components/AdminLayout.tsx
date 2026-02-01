import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Bell,
    Moon,
    Sun,
    FileText,
    ShieldCheck,
    UserCheck,
    GraduationCap,
    History,
    Home,
    BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import NotificationBell from './common/NotificationBell';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
            if (mobile && isSidebarOpen) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: user?.role === 'PRINCIPAL' ? '/principal' : '/admin' },
        { icon: FileText, label: 'Applications', path: user?.role === 'PRINCIPAL' ? '/principal/applications' : '/admin/applications' },
        ...(user?.role === 'PRINCIPAL' ? [
            { icon: UserCheck, label: 'Allotments', path: '/principal/allotments' },
            { icon: BarChart3, label: 'Insights', path: '/principal/insights' },
        ] : [
            { icon: Calendar, label: 'Interviews', path: '/admin/interviews' },
        ]),
        ...(user?.role !== 'PRINCIPAL' ? [
            { icon: Users, label: 'Faculty', path: '/admin/faculty' },
            { icon: GraduationCap, label: 'Alumni', path: '/admin/alumni' },
        ] : []),
        ...(user?.role === 'SUPER_ADMIN' ? [
            { icon: ShieldCheck, label: 'Admins', path: '/admin/users?role=ADMIN' },
        ] : []),
        ...(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'PRINCIPAL' ? [
            { icon: History, label: 'Notif Logs', path: user?.role === 'PRINCIPAL' ? '/principal/notifications' : '/admin/notifications' },
        ] : []),
        ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'PRINCIPAL' ? [
            { icon: UserCheck, label: 'Interviewers', path: user?.role === 'PRINCIPAL' ? '/principal/users?role=INTERVIEWER' : '/admin/users?role=INTERVIEWER' },
        ] : []),
        { icon: Settings, label: 'Settings', path: user?.role === 'PRINCIPAL' ? '/principal/settings' : '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-brand-cream dark:bg-slate-950 transition-colors duration-500 flex overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                animate={{ 
                    width: isSidebarOpen ? (isMobile ? '100%' : 280) : 0, 
                    x: isSidebarOpen ? 0 : (isMobile ? -300 : 0),
                    opacity: isSidebarOpen ? 1 : (isMobile ? 0 : 0)
                }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`
                    fixed lg:relative z-50 h-[100dvh] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl 
                    border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col
                    ${isMobile ? 'max-w-[300px]' : ''}
                    ${isSidebarOpen ? '' : 'pointer-events-none'}
                `}
            >
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-auto" />
                        <div className="leading-tight">
                            <span className="block text-xl font-black tracking-tighter font-outfit text-edu-coral">Darussalam</span>
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Edu Village</span>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-coral transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const currentPath = location.pathname + location.search;
                        const isActive = item.path.includes('?') 
                            ? currentPath === item.path 
                            : location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => isMobile && setIsSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all group
                                    ${isActive 
                                        ? 'bg-edu-coral text-white shadow-lg shadow-edu-coral/20' 
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-edu-coral dark:hover:text-edu-teal'}
                                `}
                            >
                                <item.icon size={20} className="shrink-0" />
                                <span className="text-sm tracking-wide">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-edu-teal/10 hover:text-edu-teal transition-all"
                    >
                        <Home size={20} />
                        <span className="text-sm">Back to Home</span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="text-sm">Log Out</span>
                    </button>
                    
                    <NavLink 
                        to={user?.role === 'PRINCIPAL' ? '/principal/profile' : '/admin/profile'} 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-edu-teal/10 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-edu-teal/20 flex items-center justify-center font-black text-edu-teal relative overflow-hidden shrink-0">
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="relative z-10">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate text-brand-deep dark:text-white uppercase tracking-tighter group-hover:text-edu-teal transition-colors">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 truncate">{user?.role}</p>
                        </div>
                    </NavLink>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col h-[100dvh] overflow-hidden">
                {/* Admin Header */}
                <header className="h-16 lg:h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 lg:px-8 flex items-center justify-between relative z-40">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/5 text-slate-500 hover:text-edu-coral shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-base sm:text-xl font-black font-outfit text-brand-deep dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
                            {user?.role === 'PRINCIPAL' ? 'Principal' : 'Admin'} <span className="text-edu-teal hidden xs:inline">Console</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <NotificationBell />
                            
                            <button 
                                onClick={toggleTheme}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-edu-coral hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                            >
                                {theme === 'light' ? <Moon size={18} className="sm:w-[20px] sm:h-[20px]" /> : <Sun size={18} className="sm:w-[20px] sm:h-[20px]" />}
                            </button>
                        </div>

                        <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2" />
                        
                        <NavLink 
                            to={user?.role === 'PRINCIPAL' ? '/principal/profile' : '/admin/profile'} 
                            className="flex items-center gap-2 sm:gap-3 group hover:opacity-80 transition-all"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-brand-deep dark:text-white leading-none truncate max-w-[100px] group-hover:text-edu-teal transition-colors">{user?.name}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {user?.role === 'PRINCIPAL' ? 'Principal' : 'Admin'}
                                </p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-edu-teal to-edu-coral p-px shadow-md">
                                <div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center font-black text-edu-teal text-[10px] sm:text-sm overflow-hidden">
                                    {user?.profileImageUrl ? (
                                        <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.[0]?.toUpperCase() || 'A'
                                    )}
                                </div>
                            </div>
                        </NavLink>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <div className="flex-grow overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
