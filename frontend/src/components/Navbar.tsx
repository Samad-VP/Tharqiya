import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Tharqawi Course', path: '/programme' },
        { name: 'Admission', path: '/admission' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-lg'
            : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg border border-slate-100 transition-transform group-hover:scale-110 duration-500 overflow-hidden">
                                <img src={logo} alt="Tharqiya Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="absolute -inset-1 bg-tharqiya-green/20 dark:bg-tharqiya-gold/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="leading-tight">
                            <span className={`block text-xl font-black tracking-tighter font-outfit transition-colors ${!scrolled ? 'text-white' : 'text-tharqiya-green dark:text-white'
                                }`}>THARQIYA</span>
                            <span className="block text-[9px] font-bold text-tharqiya-gold dark:text-tharqiya-gold/80 tracking-[0.3em] uppercase">College of Huffaz</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative group ${location.pathname === link.path
                                    ? (scrolled ? 'text-tharqiya-green dark:text-tharqiya-gold' : 'text-tharqiya-gold')
                                    : (!scrolled ? 'text-white/80 hover:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-tharqiya-green dark:hover:text-tharqiya-gold')
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-tharqiya-green dark:bg-tharqiya-gold rounded-full"
                                    />
                                )}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4" />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full transition-all duration-500 mr-4 shadow-inner ${!scrolled
                                ? 'bg-white/10 text-white hover:bg-tharqiya-gold hover:text-slate-950 border border-white/20'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-tharqiya-green hover:text-white dark:hover:bg-tharqiya-gold dark:hover:text-slate-900'
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <Link to="/admission" className="btn-primary scale-90">Apply Now</Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all ${!scrolled
                                ? 'bg-white/10 text-white border border-white/10'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-xl transition-all ${!scrolled
                                ? 'bg-tharqiya-gold text-slate-950'
                                : 'bg-tharqiya-green/10 dark:bg-tharqiya-gold/10 text-tharqiya-green dark:text-tharqiya-gold'
                                }`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 1, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] md:hidden bg-slate-950 flex flex-col pt-32 px-10 pb-20"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 islamic-pattern pointer-events-none" />
                        <div className="absolute top-1/4 -right-1/4 w-80 h-80 bg-tharqiya-gold/20 blur-[120px] rounded-full" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="space-y-8">
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
                                            className="group flex items-center justify-between"
                                        >
                                            <span className={`text-2xl sm:text-3xl font-black font-outfit tracking-tighter transition-colors ${location.pathname === link.path ? 'text-tharqiya-gold' : 'text-white'
                                                }`}>
                                                {link.name}
                                            </span>
                                            <motion.div
                                                animate={{ x: location.pathname === link.path ? 0 : -20, opacity: location.pathname === link.path ? 1 : 0 }}
                                            >
                                                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-tharqiya-gold" />
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-auto"
                            >
                                <Link to="/admission" onClick={() => setIsOpen(false)}>
                                    <button className="w-full py-4 sm:py-6 bg-tharqiya-gold text-slate-950 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl shadow-2xl shadow-tharqiya-gold/20 active:scale-95 transition-transform flex items-center justify-center gap-3">
                                        Apply for Admission <ArrowRight size={18} />
                                    </button>
                                </Link>

                                <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-8">
                                    <button onClick={toggleTheme} className="text-white/60 hover:text-tharqiya-gold font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                                        {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                                        Switch Appearance
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Close button inside overlay */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
