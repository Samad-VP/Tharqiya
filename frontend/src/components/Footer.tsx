import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import logo from '../assets/logo.png';

const XIcon = ({ size = 18 }: { size?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { Icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
        { Icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
        { Icon: XIcon, href: '#', label: 'X (formerly Twitter)', color: 'hover:text-tharqiya-deep dark:hover:text-white' },
    ];

    return (
        <footer className="bg-brand-cream dark:bg-slate-950 pt-16 sm:pt-32 pb-8 sm:pb-12 relative overflow-hidden transition-colors duration-500 border-t border-slate-200 dark:border-slate-900">
            {/* Islamic Pattern Overlay */}
            

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-16 mb-20">
                    {/* Brand Section */}
                     <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
                        <div className="flex flex-col items-center lg:items-start w-fit text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-2 sm:mb-6">
                                <div className="h-8 sm:h-10 w-auto flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                                    <img src={logo} alt="Darussalam Edu Village Official Logo" className="h-full w-auto object-contain" />
                                </div>
                                <div className="leading-tight text-left">
                                    <span className="block text-lg sm:text-xl font-black tracking-tighter font-outfit text-edu-teal">Darussalam</span>
                                    <span className="block text-[8px] sm:text-[10px] font-bold text-tharqiya-deep/70 dark:text-white/70 tracking-[0.2em]">Edu Village</span>
                                </div>
                            </div>
                            <p className="text-academic-muted dark:text-slate-400 font-medium leading-relaxed text-sm sm:text-base max-w-xs">
                                Empowering Quranic scholars with modern tools and academic brilliance. Bridging traditional wisdom with future excellence.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {socialLinks.map(({ Icon, href, label, color }, idx) => (
                                <motion.a
                                    key={idx}
                                    href={href}
                                    aria-label={label}
                                    whileHover={{ scale: 1.1, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 sm:p-4 bg-white dark:bg-slate-900/80 rounded-2xl text-tharqiya-deep/60 dark:text-slate-400 transition-all border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-tharqiya-deep/20 dark:hover:border-white/20 ${color}`}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation and Support - Grouped and Centered */}
                    <div className="col-span-1 lg:col-span-2 flex justify-center gap-12 sm:gap-24 lg:gap-32 px-4">
                        {/* Quick Links */}
                        <div className="flex flex-col items-start w-fit">
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Navigation</h4>
                            <ul className="space-y-3 sm:space-y-4 font-bold text-academic-muted dark:text-slate-400 text-xs sm:text-sm">
                                {['Home', 'About', 'Faculty', 'Alumni', 'Admission', 'Portal'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-tharqiya-deep dark:hover:text-white transition-all flex items-center justify-start group">
                                            <div className="w-0 group-hover:w-3 h-px bg-edu-teal mx-0 group-hover:mr-2 transition-all"></div>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Info */}
                        <div className="flex flex-col items-start w-fit">
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Support</h4>
                            <ul className="space-y-3 sm:space-y-4 font-bold text-academic-muted dark:text-slate-400 text-xs sm:text-sm">
                                {['Downloads', 'FAQs', 'Privacy', 'Terms', 'Contact'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-tharqiya-deep dark:hover:text-white transition-all flex items-center justify-start group">
                                            <div className="w-0 group-hover:w-3 h-px bg-edu-teal mx-0 group-hover:mr-2 transition-all"></div>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Information */}
                    <div className="flex flex-col items-center lg:items-start">
                        <div className="w-fit text-left">
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Information</h4>
                            <ul className="space-y-4 sm:space-y-6">
                                <li className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-none">
                                        <MapPin className="text-edu-teal" size={16} />
                                    </div>
                                    <span className="text-academic-muted dark:text-slate-400 font-bold text-xs sm:text-sm leading-snug">
                                        Darussalam Edu Village, <br />
                                        Kozhikode, Kerala 673322
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-none">
                                        <Phone className="text-edu-teal" size={16} />
                                    </div>
                                    <a href="tel:+919847642004" className="text-academic-muted dark:text-slate-400 font-bold text-xs sm:text-sm hover:text-edu-teal transition-colors cursor-pointer">
                                        +91 98476 42004
                                    </a>
                                </li>
                                <li className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-none">
                                        <Mail className="text-edu-teal" size={16} />
                                    </div>
                                    <a href="mailto:info@darussalameduvillage.com" className="text-academic-muted dark:text-slate-400 font-bold text-xs sm:text-sm hover:text-edu-teal transition-colors cursor-pointer">
                                        info@darussalameduvillage.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 sm:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                    <p className="text-academic-muted dark:text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-loose text-center md:text-left">
                        &copy; {new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 sm:gap-10">
                        <button
                            onClick={scrollToTop}
                            className="p-3 sm:p-4 bg-edu-teal text-white dark:text-slate-950 rounded-xl sm:rounded-2xl transition-all shadow-xl sm:shadow-2xl hover:-translate-y-2 group"
                        >
                            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
