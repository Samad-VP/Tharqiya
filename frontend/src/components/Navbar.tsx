import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from './common/NotificationBell';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Close menu on navigation or back button
    useEffect(() => {
        const handlePopState = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        setIsOpen(false); // Close menu when route changes

        return () => window.removeEventListener('popstate', handlePopState);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Tharqiya Course', path: '/programme' },
        { name: 'Faculty', path: '/faculty' },
        { name: 'Alumni', path: '/alumni' },
        { name: 'Campus Facilities', path: '/facilities' },
        { name: 'Admission', path: '/admission' },
    ];
    
    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return '/admin';
        if (user.role === 'INTERVIEWER') return '/interviewer';
        if (user.role === 'PRINCIPAL') return '/principal';
        return '/student/portal';
    };

    const getDashboardLabel = () => {
        if (!user) return 'Login';
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return 'Admin Dashboard';
        if (user.role === 'INTERVIEWER') return 'Interviewer Portal';
        if (user.role === 'PRINCIPAL') return 'Principal Hub';
        return 'Student Portal';
    };

    return (
        <>
            <nav className={`fixed w-full transition-all duration-500 ${isOpen ? 'z-[9999]' : 'z-50'} ${scrolled
            ? 'bg-brand-cream/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-lg'
            : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group transition-opacity duration-300 self-center shrink-0">
                        <div className="relative flex items-center shrink-0">
                            <div className="h-10 lg:h-12 w-auto flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                                <img src={logo} alt="Darussalam Edu Village Official Logo" className="h-full w-auto object-contain" />
                            </div>
                        </div>
                        <div className="leading-tight flex flex-col justify-center">
                            <span className="block text-xl font-black tracking-tighter font-outfit text-edu-coral">Darussalam</span>
                            <span className={`block text-[10px] font-bold tracking-[0.2em] transition-colors ${!scrolled ? (theme === 'light' ? 'text-brand-deep' : 'text-white/70') : 'text-brand-deep dark:text-white/70'}`}>Edu Village</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center flex-1 ml-8 lg:ml-12">
                        <div className="flex items-center gap-1 lg:gap-2 xl:gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 lg:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative group whitespace-nowrap flex items-center h-10 ${location.pathname === link.path
                                        ? (scrolled ? 'text-edu-teal dark:text-edu-teal' : 'text-edu-teal')
                                        : (!scrolled ? (theme === 'light' ? 'text-brand-deep/70 hover:text-edu-coral' : 'text-white/80 hover:text-white') : 'text-brand-deep dark:text-slate-300 hover:text-edu-coral dark:hover:text-edu-teal')
                                        }`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-edu-coral dark:bg-edu-teal rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Actions Cluster - Pushed to right on LG+ */}
                        <div className="flex items-center ml-auto gap-1 lg:gap-2">
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 lg:mx-3 xl:mx-4" />

                            {/* Notification Bell */}
                            {user && <NotificationBell />}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-full transition-all duration-500 mr-2 lg:mr-3 xl:mr-4 shadow-inner flex items-center justify-center h-10 w-10 ${!scrolled
                                    ? 'bg-white/10 text-white hover:bg-edu-teal hover:text-slate-950 border border-white/20'
                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-edu-coral hover:text-white dark:hover:bg-edu-teal dark:hover:text-slate-900'
                                    }`}
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            <Link 
                                to={getDashboardLink()} 
                                className={`btn-primary !py-0 !px-4 lg:!px-6 !text-sm flex items-center justify-center h-10 whitespace-nowrap mr-2 !shadow-sm ${user 
                                    ? '!bg-edu-teal !text-slate-950 hover:!bg-edu-teal/90' 
                                    : '!bg-edu-teal !text-slate-950 hover:!bg-edu-teal/90'
                                }`}
                            >
                                {getDashboardLabel()}
                            </Link>

                            <Link to="/admission" className="btn-primary py-2.5 px-5 !text-sm flex items-center justify-center h-10 whitespace-nowrap">Apply Now</Link>
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-4">
                        {user && <NotificationBell />}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${!scrolled
                                ? (theme === 'light' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white/10 text-white border border-white/10')
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${!scrolled
                                ? (theme === 'light' ? 'bg-edu-coral/10 text-edu-coral border border-edu-coral/20' : 'bg-white/10 text-white border border-white/20')
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white'
                                }`}
                            aria-label="Toggle Menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            </nav>

            {/* Mobile Menu Overlay moved outside nav to prevent containing block clipping */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[100] md:hidden bg-brand-cream/100 dark:bg-slate-950/100 backdrop-blur-3xl flex flex-col pt-24 sm:pt-32 px-6 sm:px-10 pb-10 sm:pb-20 shadow-2xl overflow-y-auto"
                    >
                        <div className="absolute top-1/4 -right-1/4 w-80 h-80 bg-edu-teal/20 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col min-h-full">
                            <div className="space-y-4 sm:space-y-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between py-2"
                                        >
                                            <span className={`text-xl sm:text-3xl font-black font-outfit tracking-tighter transition-colors ${location.pathname === link.path 
                                                ? 'text-edu-teal dark:text-edu-teal' 
                                                : 'text-brand-deep dark:text-white'
                                                }`}>
                                                {link.name}
                                            </span>
                                            <motion.div
                                                animate={{ x: location.pathname === link.path ? 0 : -20, opacity: location.pathname === link.path ? 1 : 0 }}
                                            >
                                                <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 text-edu-teal" />
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 sm:mt-auto"
                            >
                                <div className="flex flex-col gap-4">
                                    <Link to="/admission" className="w-full" onClick={() => setIsOpen(false)}>
                                        <button className="w-full py-4 sm:py-5 bg-brand-deep dark:bg-tharqiya-gold text-white dark:text-slate-950 rounded-2xl sm:rounded-3xl font-black text-base sm:text-xl shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-3">
                                            Apply for Admission <ArrowRight size={18} />
                                        </button>
                                    </Link>
                                    
                                    <Link to={getDashboardLink()} className="w-full" onClick={() => setIsOpen(false)}>
                                        <button className="w-full py-4 sm:py-5 bg-edu-teal text-slate-950 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg shadow-xl shadow-edu-teal/10 active:scale-95 transition-transform flex items-center justify-center gap-3">
                                            {getDashboardLabel()} <ArrowRight size={18} />
                                        </button>
                                    </Link>
                                </div>

                                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100 dark:border-white/10 flex justify-center gap-6 sm:gap-8">
                                    <button onClick={toggleTheme} className="text-slate-500 dark:text-white/60 hover:text-edu-coral dark:hover:text-edu-teal font-black uppercase tracking-widest text-[8px] sm:text-xs flex items-center gap-2">
                                        {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                                        Appearance
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Close button inside overlay */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 active:scale-90 transition-transform"
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
