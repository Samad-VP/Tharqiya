import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    Bell, 
    LogOut, 
    Menu, 
    X,
    Moon,
    Sun,
    BookOpen,
    Home,
    Map
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

interface StudentLayoutProps {
    children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
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
        { icon: LayoutDashboard, label: 'Portal Home', path: '/student/portal' },
        { icon: Map, label: 'My Allotment', path: '/student/allotment' },
        { icon: User, label: 'My Profile', path: '/student/profile' },
        { icon: Bell, label: 'Notifications', path: '/student/notifications' },
        { icon: BookOpen, label: 'Resources', path: '/student/resources' },
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
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ 
                    x: isSidebarOpen ? 0 : -320,
                    width: isMobile ? 320 : (isSidebarOpen ? 280 : 0)
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`
                    fixed lg:sticky top-0 z-[60] h-[100dvh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl 
                    border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shrink-0
                    ${isSidebarOpen ? '' : 'pointer-events-none lg:pointer-events-auto'}
                `}
            >
                {/* Sidebar Header */}
                <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <motion.img 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            src={logo} 
                            alt="Logo" 
                            className="w-9 sm:w-10 h-auto" 
                        />
                        <div className="leading-tight">
                            <span className="block text-lg sm:text-xl font-black tracking-tighter font-outfit text-edu-teal">Darussalam</span>
                            <span className="block text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Edu Village</span>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-edu-teal transition-all duration-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                        >
                            <NavLink
                                to={item.path}
                                onClick={() => isMobile && setIsSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-4 py-3 rounded-xl font-black transition-all duration-300 group relative overflow-hidden
                                    ${isActive 
                                        ? 'bg-edu-coral text-white shadow-lg shadow-edu-coral/20' 
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-edu-teal dark:hover:text-edu-teal'}
                                `}
                            >
                                <item.icon size={20} className={`shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`} />
                                <span className="text-xs tracking-widest uppercase">{item.label}</span>
                                {!location.pathname.includes(item.path) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-edu-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 sm:p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <motion.button 
                        whileHover={{ x: 5 }}
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-black text-slate-500 hover:bg-edu-teal/10 hover:text-edu-teal transition-all duration-300 uppercase tracking-widest text-[10px]"
                    >
                        <Home size={18} />
                        <span>Back to Home</span>
                    </motion.button>

                    <motion.button 
                        whileHover={{ x: 5 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-black text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-all duration-300 uppercase tracking-widest text-[10px]"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </motion.button>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/20 dark:border-slate-800/20 shadow-sm transition-all duration-500 hover:border-edu-teal/30 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-edu-teal to-blue-500 flex items-center justify-center font-black text-white relative overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <span className="relative z-10 text-base">{user?.name?.[0]?.toUpperCase() || 'S'}</span>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[11px] font-black truncate text-brand-deep dark:text-white uppercase tracking-tighter leading-tight">{user?.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 truncate capitalize tracking-widest mt-0.5">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className={`flex-grow flex flex-col h-[100dvh] overflow-hidden transition-all duration-500 ${!isMobile && isSidebarOpen ? 'ml-0' : ''}`}>
                {/* Header */}
                <header className="h-20 sm:h-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-8 flex items-center justify-between relative z-40">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-edu-teal shadow-sm border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                        <div className="flex flex-col">
                            <h1 className="text-base sm:text-xl font-black font-outfit text-brand-deep dark:text-white tracking-widest uppercase leading-none">
                                Applicant <span className="text-edu-teal">Portal</span>
                            </h1>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">Darussalam Edu Village</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 12 }}
                            whileTap={{ scale: 0.9, rotate: -12 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-edu-teal hover:bg-edu-teal/10 transition-all duration-300"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </motion.button>

                        <div className="h-6 w-px bg-slate-200/50 dark:bg-slate-800/50 mx-1" />
                        
                        <NavLink to="/student/profile" className="flex items-center gap-3 hover:opacity-80 transition-all group">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-brand-deep dark:text-white leading-none truncate max-w-[100px] uppercase tracking-wider">{user?.name}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Candidate Dashboard</p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-edu-teal via-edu-coral to-edu-yellow p-[1.5px] shadow-lg group-hover:rotate-3 transition-all duration-500">
                                <div className="w-full h-full rounded-[0.55rem] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-edu-teal text-[10px] sm:text-xs">
                                    {user?.name?.[0]?.toUpperCase() || 'S'}
                                </div>
                            </div>
                        </NavLink>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <motion.div 
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar relative bg-brand-cream/30 dark:bg-slate-950/30"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default StudentLayout;
