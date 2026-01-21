import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-950 pt-32 pb-12 relative overflow-hidden transition-colors duration-500">
            {/* Islamic Pattern Overlay */}
            

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-auto flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                                <img src={logo} alt="Darussalam Logo Icon" className="h-full w-auto object-contain" />
                            </div>
                            <div className="leading-tight">
                                <span className="block text-xl font-black tracking-tighter font-outfit text-edu-coral">Darussalam</span>
                                <span className="block text-[10px] font-bold text-white/70 tracking-[0.2em]">Edu Village</span>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed text-center md:text-left">
                            Empowering Quranic scholars with modern tools and academic brilliance. Bridging traditional wisdom with future excellence.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ scale: 1.1, backgroundColor: '#C5A059', color: '#fff' }}
                                    className="p-3 bg-slate-800/50 rounded-xl text-slate-400 transition-all border border-slate-800"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-edu-teal">Navigation</h4>
                        <ul className="space-y-4 font-bold text-slate-400">
                            {['Home', 'About Tharqiya', 'Tharqiya Course', 'Admission', 'Student Portal'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-white transition-all flex items-center justify-center md:justify-start group">
                                        <div className="w-0 group-hover:w-4 h-px bg-edu-teal mr-0 group-hover:mr-3 transition-all invisible md:visible"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Info */}
                    <div className="text-center md:text-left">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-edu-teal">Support</h4>
                        <ul className="space-y-4 font-bold text-slate-400">
                            {['Downloads', 'Admission FAQs', 'Privacy Policy', 'Terms of Study', 'Contact Support'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-white transition-all flex items-center justify-center md:justify-start group">
                                        <div className="w-0 group-hover:w-4 h-px bg-edu-teal mr-0 group-hover:mr-3 transition-all invisible md:visible"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="text-center md:text-left">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-edu-teal">Information</h4>
                        <ul className="space-y-6">
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div className="w-10 h-10 bg-slate-800/30 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-edu-teal" size={18} />
                                </div>
                                <span className="text-slate-400 font-bold text-sm leading-snug">
                                    Darussalam Tharqiyathul Huffaz, <br />
                                    Edu Village, Darussalam, <br />
                                    Kozhikode, Kerala 673322
                                </span>
                            </li>
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div className="w-10 h-10 bg-slate-800/30 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="text-edu-teal" size={18} />
                                </div>
                                <span className="text-slate-400 font-bold text-sm">+91 496 2673322</span>
                            </li>
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div className="w-10 h-10 bg-slate-800/30 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="text-edu-teal" size={18} />
                                </div>
                                <span className="text-slate-400 font-bold text-sm">info@tharqiya.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-slate-500 text-[10px] sm:text-xs font-black font-outfit uppercase tracking-[0.2em] leading-loose text-center md:text-left">
                        &copy; {new Date().getFullYear()} Darussalam Edu Village. All rights reserved.
                    </p>

                    <div className="flex items-center gap-10">
                        <button
                            onClick={scrollToTop}
                            className="p-4 bg-edu-teal text-white dark:text-slate-950 rounded-2xl transition-all shadow-2xl hover:-translate-y-2 group"
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
