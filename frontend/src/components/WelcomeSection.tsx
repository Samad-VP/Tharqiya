import React from 'react';
import { motion } from 'framer-motion';
import campusBg from '../assets/campus-view.jpg';
import logo from '../assets/logo.png';

const WelcomeSection: React.FC = () => {
    return (
        <section className="py-24 bg-brand-cream dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                    {/* Content Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-3/5"
                    >
                        <div className="flex items-start gap-4 mb-6 md:mb-8">
                            <div className="w-3 md:w-4 h-10 md:h-20 bg-edu-coral dark:bg-edu-teal rounded-sm shrink-0 mt-1 md:mt-2" />
                            <h2 className="text-3xl md:text-6xl font-black text-edu-teal font-outfit tracking-tighter uppercase leading-[0.95]">
                                Welcome to <br /> Darussalam <span className="text-edu-coral">Edu Village</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-edu-coral/80 dark:text-edu-teal/80 font-medium leading-relaxed text-base md:text-lg">
                            <p>
                                Darussalam Edu Village stands as the central campus for the esteemed Tharqiya course offered by Darussalam Islamic University, catering to individuals who have committed the entire Quran to memory. This comprehensive program provides students with a unique opportunity to pursue secondary to postgraduate education in both Islamic and academic disciplines. Upon successful completion, graduates are bestowed with the prestigious title of 'Tharqawee', symbolizing their dedication to Quranic scholarship and academic excellence.
                            </p>
                            
                            <p>
                                At the heart of our institution lies a visionary mission: to nurture Islamic propagators imbued with the embodiment of the Quran. Our goal extends beyond mere academic achievement; we aim to cultivate individuals who serve as role models for their communities and society at large. By integrating religious principles with contemporary knowledge, we equip our students with the tools and mindset necessary to navigate the complexities of the modern world while staying true to their faith.
                            </p>

                            <p className="font-bold text-edu-teal border-l-4 border-edu-teal pl-6 py-2 bg-edu-teal/5 rounded-r-xl italic">
                                We adhere to the ideology of Samastha Kerala Jamiyyathul Ulama and actively promote student involvement in its organizations and volunteer initiatives.
                            </p>

                            <p>
                                Darussalam Edu Village is more than just an educational institution; it is a beacon of enlightenment, a sanctuary for intellectual growth, and a bastion of spiritual development. Through our rigorous academic curriculum, experiential learning opportunities, and supportive community, we strive to empower our students to become compassionate leaders, effective communicators, and catalysts for positive change in the world.
                            </p>

                            <p className="text-edu-coral dark:text-white font-black">
                                Join us at Darussalam Edu Village, where knowledge meets devotion, and excellence is the norm. Together, let us embark on a journey of discovery, enlightenment, and transformation, as we strive to build a brighter future guided by the timeless teachings of the Quran.
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-12">
                            <div className="w-3 h-3 rounded-full bg-edu-coral" />
                            <div className="w-3 h-3 rounded-full bg-edu-teal" />
                            <div className="w-3 h-3 rounded-full bg-edu-coral/50" />
                            <div className="w-3 h-3 rounded-full bg-edu-teal/50" />
                        </div>
                    </motion.div>

                    {/* Image/Visual Area */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="lg:w-2/5 relative w-full"
                    >
                        <div className="relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-slate-800 rotate-2 group cursor-none">
                            <img 
                                src={campusBg} 
                                alt="Campus Life" 
                                className="w-full h-[400px] md:h-[600px] object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                            
                            {/* Logo Overlay */}
                            <div className="absolute top-8 right-8 p-0 h-20 w-auto flex items-center justify-center">
                                <img src={logo} alt="Logo" className="h-full w-auto object-contain drop-shadow-2xl" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
