import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Library, History, Trophy, Sparkles } from 'lucide-react';
import campusBg from '../assets/campus-view.jpg';

const Hero: React.FC = () => {
    return (
        <div className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-20 overflow-hidden bg-slate-950">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0">
                <img
                    src={campusBg}
                    alt="Edu Village Campus"
                    className="w-full h-full object-cover scale-105"
                />
                {/* Deep Gradient & Islamic Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent dark:from-black dark:via-slate-950/90 dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

                {/* Islamic Pattern with Glass Blur */}
                <div className="absolute inset-0 opacity-[0.07] islamic-pattern mix-blend-overlay" />

                {/* Golden Light Flare */}
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-tharqiya-gold/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 py-1.5 px-4 sm:py-2 sm:px-5 rounded-full bg-tharqiya-gold/10 backdrop-blur-md border border-tharqiya-gold/20 mb-6 sm:mb-8"
                        >
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-tharqiya-gold" />
                            <span className="text-tharqiya-gold text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase">Phase II Admissions Open • 2026-27</span>
                        </motion.div>

                        {/* Title with Gradient and Shadow */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] sm:leading-[1.05] mb-5 sm:mb-8 font-outfit tracking-tighter drop-shadow-2xl">
                            Nurturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-tharqiya-gold via-amber-200 to-tharqiya-gold">Sacred Mindset</span> <br className="hidden lg:block" /> for Modern Worlds
                        </h1>

                        {/* Description with High Legibility */}
                        <p className="text-base sm:text-xl md:text-2xl text-slate-200/90 mb-8 sm:mb-12 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                            A 10-year integrated journey where Quranic wisdom harmonizes with academic brilliance. Exclusively for memorizers of the Holy Quran.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5">
                            <Link to="/admission" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(212, 175, 55, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-tharqiya-gold text-slate-950 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl transition-all"
                                >
                                    Apply Now <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.button>
                            </Link>
                            <Link to="/programme" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-white/10 transition-all flex items-center justify-center"
                                >
                                    Explore Course
                                </motion.button>
                            </Link>
                        </div>

                        {/* Feature Stats */}
                        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-10 sm:pt-12 border-t border-white/10 max-w-5xl">
                            {[
                                { icon: Library, label: 'Integrated Syllabus', sub: 'Traditional & Modern' },
                                { icon: History, label: 'Masters Program', sub: 'Hifz Revision focus' },
                                { icon: Trophy, label: 'Residential Degree', sub: 'UGC Recognized' },
                                { icon: Sparkles, label: '100% Scholarship', sub: 'Food & Accommodation' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex flex-col gap-1 sm:gap-2 group cursor-default"
                                >
                                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-tharqiya-gold mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">{item.label}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{item.sub}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Visual Element */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent invisible dark:visible" />
        </div>
    );
};

export default Hero;
