import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Globe, Star, Quote, Award } from 'lucide-react';

const alumniSuccess = [
    {
        name: "Hafiz Ahmed Kabir",
        batch: "Class of 2018",
        position: "Ph.D. Scholar at Al-Azhar University, Cairo",
        achievement: "Specialized in Comparative Fiqh and Islamic Finance.",
        quote: "Tharqiya didn't just teach me the Quran; it gave me the intellectual framework to engage with the modern world as a scholar."
    },
    {
        name: "Hafiz Salman Faris",
        batch: "Class of 2020",
        position: "Civil Servant & Ethical Consultant",
        achievement: "Successfully cleared State Administrative Exams with high rank.",
        quote: "The integrated curriculum allowed me to pursue my spiritual calling while excel in government service."
    }
];

const stats = [
    { label: "Total Graduates", value: "250+", icon: GraduationCap },
    { label: "Global Presence", value: "12+ Countries", icon: Globe },
    { label: "Higher Pursuits", value: "85%", icon: Star },
    { label: "In Leadership Roles", value: "120+", icon: Briefcase }
];

const AlumniPage: React.FC = () => {
    return (
        <div className="bg-brand-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-40 bg-brand-cream/50 dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-coral/10 text-edu-coral text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-coral/20">
                            Our Global Impact
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-brand-deep dark:text-white font-outfit mb-6 tracking-tighter">
                            Tharqawi <span className="text-edu-coral">Alumni</span>
                        </h1>
                        <p className="text-sm sm:text-xl md:text-2xl text-brand-deep/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
                            A global network of scholars, leaders, and professionals bridging sacred tradition with modern innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-10 sm:-mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/80 dark:bg-slate-900 border border-white/50 dark:border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl backdrop-blur-xl text-center"
                            >
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-edu-teal/10 text-edu-teal rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-6xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase mb-6">
                            Success <span className="text-edu-teal">Stories</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
                        {alumniSuccess.map((alumni, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-br from-edu-teal/20 to-edu-coral/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative bg-brand-cream dark:bg-slate-900/60 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl h-full flex flex-col gap-8">
                                    <div className="flex flex-col">
                                        <Quote className="text-edu-teal/20 w-10 h-10 mb-4" />
                                        <h3 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit leading-tight mb-2">
                                            {alumni.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs font-black text-edu-coral uppercase tracking-widest mb-4">
                                            {alumni.batch} | {alumni.position}
                                        </p>
                                        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 italic mb-6 leading-relaxed">
                                            "{alumni.quote}"
                                        </p>
                                        <div className="mt-auto flex items-center gap-3 py-2 px-4 bg-slate-50 dark:bg-white/5 rounded-xl w-fit">
                                            <Award className="w-4 h-4 text-edu-teal" size={16} />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.achievement}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 bg-edu-teal relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter mb-8">
                        Are you a Tharqawi Alumnus?
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium">
                        Join our global network to stay connected, mentor junior scholars, and access exclusive professional opportunities.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-white text-edu-teal rounded-full font-black text-lg shadow-2xl transition-all tracking-widest uppercase hover:bg-brand-cream"
                    >
                        Join the Network
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default AlumniPage;
