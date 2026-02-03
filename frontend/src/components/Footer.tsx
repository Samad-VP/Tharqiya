import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-950 pt-16 sm:pt-32 pb-8 sm:pb-12 relative overflow-hidden transition-colors duration-500">
            {/* Islamic Pattern Overlay */}
            

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-16 mb-20">
                    {/* Brand Section */}
                     <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                        <div className="flex items-center gap-3 mb-2 sm:mb-6">
                            <div className="h-8 sm:h-10 w-auto flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                                <img src={logo} alt="Darussalam Edu Village Official Logo" className="h-full w-auto object-contain" />
                            </div>
                            <div className="leading-tight">
                                <span className="block text-lg sm:text-xl font-black tracking-tighter font-outfit text-edu-coral">Darussalam</span>
                                <span className="block text-[8px] sm:text-[10px] font-bold text-white/70 tracking-[0.2em]">Edu Village</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed text-center text-sm sm:text-base">
                            Empowering Quranic scholars with modern tools and academic brilliance. Bridging traditional wisdom with future excellence.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ scale: 1.1, backgroundColor: '#C5A059', color: '#fff' }}
                                    className="p-2 sm:p-3 bg-slate-800/50 rounded-lg sm:rounded-xl text-slate-400 transition-all border border-slate-800"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                     {/* Quick Links */}
                    <div className="text-center">
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Navigation</h4>
                        <ul className="space-y-3 sm:space-y-4 font-bold text-slate-400 text-sm sm:text-base">
                            {['Home', 'About Tharqiya', 'Tharqiya Course', 'Faculty', 'Alumni', 'Admission', 'Student Portal'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-white transition-all flex items-center justify-center group">
                                        <div className="w-0 group-hover:w-4 h-px bg-edu-teal mx-0 group-hover:mx-3 transition-all"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Info */}
                    <div className="text-center">
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Support</h4>
                        <ul className="space-y-3 sm:space-y-4 font-bold text-slate-400 text-sm sm:text-base">
                            {['Downloads', 'Admission FAQs', 'Privacy Policy', 'Terms of Study', 'Contact Support'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-white transition-all flex items-center justify-center group">
                                        <div className="w-0 group-hover:w-4 h-px bg-edu-teal mx-0 group-hover:mx-3 transition-all"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 text-center">
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-edu-teal">Information</h4>
                        <ul className="space-y-4 sm:space-y-6">
                            <li className="flex flex-col items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-edu-teal" size={16} />
                                </div>
                                <span className="text-slate-400 font-bold text-xs sm:text-sm leading-snug">
                                    Darussalam Edu Village, <br />
                                    Kozhikode, Kerala 673322
                                </span>
                            </li>
                            <li className="flex flex-col items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="text-edu-teal" size={16} />
                                </div>
                                <a href="tel:+919847642004" className="text-slate-400 font-bold text-xs sm:text-sm hover:text-edu-teal transition-colors cursor-pointer">
                                    +91 98476 42004
                                </a>
                            </li>
                            <li className="flex flex-col items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="text-edu-teal" size={16} />
                                </div>
                                <a href="mailto:info@darussalameduvillage.com" className="text-slate-400 font-bold text-xs sm:text-sm hover:text-edu-teal transition-colors cursor-pointer">
                                    info@darussalameduvillage.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 sm:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-loose text-center md:text-left">
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
