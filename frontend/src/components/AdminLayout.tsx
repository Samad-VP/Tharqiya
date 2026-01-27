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
    History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: user?.role === 'PRINCIPAL' ? '/principal' : '/admin' },
        { icon: FileText, label: 'Applications', path: user?.role === 'PRINCIPAL' ? '/principal/applications' : '/admin/applications' },
        ...(user?.role === 'PRINCIPAL' ? [
            { icon: UserCheck, label: 'Allotments', path: '/principal/allotments' },
        ] : [
            { icon: Calendar, label: 'Interviews', path: '/admin/interviews' },
        ]),
        ...(user?.role === 'SUPER_ADMIN' ? [
            { icon: ShieldCheck, label: 'Admins', path: '/admin/users?role=ADMIN' },
            { icon: History, label: 'Notif Logs', path: '/admin/notifications' },
        ] : []),
        ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'PRINCIPAL' ? [
            { icon: UserCheck, label: 'Interviewers', path: user?.role === 'PRINCIPAL' ? '/principal/users?role=INTERVIEWER' : '/admin/users?role=INTERVIEWER' },
        ] : []),
        { icon: Settings, label: 'Settings', path: user?.role === 'PRINCIPAL' ? '/principal/settings' : '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-brand-cream dark:bg-slate-950 transition-colors duration-500 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className={`fixed lg:relative z-50 h-screen bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 ${isSidebarOpen ? '' : 'overflow-hidden'}`}
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
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const currentPath = location.pathname + location.search;
                        const isActive = item.path.includes('?') 
                            ? currentPath === item.path 
                            : location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
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
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="text-sm">Log Out</span>
                    </button>
                    
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5">
                        <div className="w-10 h-10 rounded-xl bg-edu-teal/20 flex items-center justify-center font-black text-edu-teal">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate text-brand-deep dark:text-white uppercase tracking-tighter">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col h-screen overflow-hidden">
                {/* Admin Header */}
                <header className="h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-8 flex items-center justify-between relative z-40">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-coral transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg sm:text-xl font-black font-outfit text-brand-deep dark:text-white tracking-tight truncate">
                            {user?.role === 'PRINCIPAL' ? 'Principal' : 'Admin'} <span className="text-edu-teal hidden sm:inline">Console</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <button 
                                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-coral transition-colors relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-edu-coral rounded-full" />
                            </button>
                            
                            <button 
                                onClick={toggleTheme}
                                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-coral transition-colors"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2" />
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-brand-deep dark:text-white leading-none">{user?.name}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {user?.role === 'PRINCIPAL' ? 'Principal' : 'Administrator'}
                                </p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-edu-teal to-edu-coral p-px shadow-lg">
                                <div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center font-black text-edu-teal text-xs sm:text-sm">
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
