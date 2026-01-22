import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import campusBg from '../assets/campus-view.jpg';

const Hero: React.FC = () => {
    return (
        <div className="relative min-h-screen flex items-center pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-slate-950">
            {/* Full Screen Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={campusBg} 
                    alt="Campus Background" 
                    className="w-full h-full object-cover opacity-50 dark:opacity-30 sm:opacity-60 dark:sm:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent opacity-70" />
            </div>

            {/* Geometric Accent Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-edu-teal/5 rotate-[35deg] transform-gpu" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                <div className="absolute bottom-[-5%] right-[5%] w-[40%] h-[40%] bg-edu-coral/5 rotate-[15deg] transform-gpu" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-4xl">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-left"
                    >
                        {/* Status Label */}
                        <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
                            <div className="w-10 sm:w-12 h-1 bg-edu-coral rounded-full" />
                            <span className="text-white text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.4em]">
                                Explore The Future
                            </span>
                        </div>

                        {/* Typography */}
                        <h1 className="flex flex-col gap-1 sm:gap-2 mb-10 md:mb-16">
                            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-edu-coral tracking-tighter leading-none">
                                Darussalam
                            </span>
                            <span className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.8] mt-1">
                                Edu Village
                            </span>
                        </h1>

                        <div className="space-y-4 mb-10 sm:mb-16 border-l-4 border-edu-teal/30 pl-6 sm:pl-8">
                            <div className="space-y-1">
                                <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">
                                    Darussalam Edu Village
                                </h2>
                                <p className="text-[10px] sm:text-sm font-black text-edu-teal uppercase tracking-widest">
                                    Under : Darussalam Islamic University
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <Link to="/admission">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto px-8"
                                >
                                    Apply Now <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                            <Link to="/programme">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-glass w-full sm:w-auto"
                                >
                                    Explore Course
                                </motion.button>
                            </Link>
                        </div>

                        {/* Domain Link */}
                        <div className="mt-16 sm:mt-20 text-[10px] font-black text-white/30 tracking-[0.5em] uppercase hidden lg:block hover:text-edu-teal transition-colors cursor-pointer">
                            www.jamiadarussalam.org
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
