import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import logo from '../assets/logo.png';

const WelcomeSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-24 bg-brand-cream dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                {/* Content Area */}
                <motion.div 
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 md:mb-12">
                        <div className="w-12 h-2 sm:w-20 sm:h-3 bg-edu-coral dark:bg-edu-teal rounded-full mb-4" />
                        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-tharqiya-deep dark:text-white font-outfit tracking-tighter uppercase leading-[0.95]">
                            Welcome to <br /> Darussalam <span className="text-gold-orange">Edu Village</span>
                        </h2>
                    </div>

                    <div className="space-y-6 sm:space-y-8 text-academic-muted leading-relaxed text-base sm:text-xl">
                        <p>
                            Darussalam Edu Village stands as the central campus for the esteemed Tharqiya course offered by Darussalam Islamic University (DIU), catering to individuals who have committed the entire Quran to memory.
                        </p>
                        
                        <p>
                            Our goal extends beyond mere academic achievement; we aim to cultivate individuals who serve as role models for their communities and society at large. 
                        </p>

                        <div className="flex justify-center py-4">
                            <p className="font-bold text-tharqiya-deep dark:text-edu-teal border-l-4 border-edu-teal pl-6 py-3 bg-edu-teal/5 rounded-r-2xl italic text-sm sm:text-lg max-w-2xl">
                                We adhere to the ideology of Samastha Kerala Jamiyyathul Ulama and actively promote student involvement in its organizations.
                            </p>
                        </div>

                        <p className="hidden sm:block">
                            Darussalam Edu Village is more than just an educational institution; it is a beacon of enlightenment, a sanctuary for intellectual growth, and a bastion of spiritual development.
                        </p>

                        <p className="text-tharqiya-deep dark:text-white font-black text-lg sm:text-2xl mt-8">
                            Join us at Darussalam Edu Village, where knowledge meets devotion, and excellence is the norm.
                        </p>
                    </div>

                    {/* YouTube Video Section */}
                    <motion.div 
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="mt-16 sm:mt-24 w-full relative group"
                    >
                        {/* Atmospheric Decorations */}
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-edu-teal/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-edu-coral/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                        
                        {/* Premium Video Container */}
                        <div className="relative mx-auto max-w-5xl">
                            {/* Glassmorphism Outer Frame */}
                            <div className="absolute -inset-1 sm:-inset-4 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/40 dark:border-white/10 shadow-2xl -z-10" />
                            
                            {/* Inner Video Box */}
                            <div className="relative aspect-video w-full rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-4 border-white dark:border-slate-800 bg-slate-900 group-hover:scale-[1.01] transition-transform duration-700">
                                <iframe 
                                    className="absolute inset-0 w-full h-full"
                                    src="https://www.youtube.com/embed/7nmcvYZNpG0" 
                                    title="Darussalam Edu Village Campus Tour"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                                
                                {/* Overlay Gradient for better integration */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                        </div>

                        {/* Premium Badge Caption */}
                        <div className="mt-12 flex flex-col items-center">
                            <motion.div 
                                whileHover={{ y: -2 }}
                                className="px-6 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-3"
                            >
                                <span className="w-2 h-2 rounded-full bg-edu-teal animate-ping" />
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-tharqiya-deep dark:text-white">
                                    Experience Our <span className="text-edu-teal">Flagship Campus</span>
                                </span >
                            </motion.div>
                            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-edu-teal/30 to-transparent rounded-full" />
                        </div>
                    </motion.div>
                    
                    <div className="flex justify-center gap-4 mt-16">
                        <div className="w-4 h-4 rounded-full bg-edu-coral animate-pulse" />
                        <div className="w-4 h-4 rounded-full bg-edu-teal animate-pulse [animation-delay:200ms]" />
                        <div className="w-4 h-4 rounded-full bg-edu-coral/50 animate-pulse [animation-delay:400ms]" />
                        <div className="w-4 h-4 rounded-full bg-edu-teal/50 animate-pulse [animation-delay:600ms]" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WelcomeSection;
