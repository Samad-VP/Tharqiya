import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Globe, Star, Quote, Award, Loader2, MapPin, School, Building2 } from 'lucide-react';
import api from '../api/axiosInstance';

const AlumniPage: React.FC = () => {
    const [alumnis, setAlumnis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlumnis = async () => {
            try {
                const response = await api.get('/alumni');
                setAlumnis(response.data.data || []);
            } catch (error) {
                console.error('Error fetching alumni:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlumnis();
    }, []);

    const stats = [
        { label: "Total Graduates", value: "250+", icon: GraduationCap },
        { label: "Global Presence", value: "12+ Countries", icon: Globe },
        { label: "Higher Pursuits", value: "85%", icon: Star },
        { label: "In Leadership Roles", value: "120+", icon: Briefcase }
    ];

    return (
        <div className="bg-brand-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-48 sm:pb-32 bg-brand-cream/50 dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-coral/10 text-edu-coral text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-coral/20">
                            Our Global Impact
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-brand-deep dark:text-white font-outfit mb-6 tracking-tighter uppercase leading-none">
                            Tharqiya <span className="text-edu-coral">Alumni</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-brand-deep/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
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
                                className="bg-white/80 dark:bg-slate-900 border border-white/50 dark:border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl backdrop-blur-xl text-center hover:scale-105 transition-transform"
                            >
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-edu-teal/10 text-edu-teal rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit mb-1 leading-none">
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
                        <h2 className="text-3xl md:text-6xl font-black text-brand-deep dark:text-white font-outfit tracking-tighter uppercase mb-6 leading-none">
                            Scholarly <span className="text-edu-teal">&</span> Professional <span className="text-edu-coral">Success</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-edu-coral animate-spin" />
                            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Loading Registry...</p>
                        </div>
                    ) : alumnis.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {alumnis.map((alumni, idx) => (
                                <motion.div
                                    key={alumni.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="relative group p-8 rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-2xl overflow-hidden flex flex-col h-full hover:scale-[1.02] transition-all"
                                >
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                            {alumni.photoUrl ? (
                                                <img src={alumni.photoUrl} alt={alumni.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl font-black text-slate-200">{alumni.name?.[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter leading-tight">
                                                {alumni.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                                                <MapPin size={10} className="text-edu-teal" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{alumni.place}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        <div className="inline-block px-3 py-1 bg-brand-deep text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none mb-2">
                                            {alumni.status === 'WORKING' ? 'Professional' : 'Scholarly'}
                                        </div>

                                        {alumni.status === 'WORKING' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Briefcase size={14} className="text-edu-teal" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.position}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Building2 size={14} className="text-edu-coral" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.organization}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <School size={14} className="text-edu-teal" />
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.institution}</p>
                                                </div>
                                                {alumni.university && (
                                                    <div className="flex items-center gap-3">
                                                        <GraduationCap size={14} className="text-edu-coral" />
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alumni.university}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Quote size={40} className="rotate-180" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-[0.2em]">Tracing Impact...</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">Registry will be available soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-deep relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter mb-8 uppercase leading-tight">
                        Are you a <span className="text-edu-teal">Tharqiya</span> Alumnus?
                    </h2>
                    <p className="text-sm sm:text-lg text-white/80 mb-12 max-w-2xl mx-auto font-bold uppercase tracking-wide">
                        Join our global network to stay connected, mentor junior scholars, and access exclusive professional opportunities.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-edu-teal text-white rounded-2xl font-black text-xs shadow-2xl transition-all tracking-widest uppercase hover:bg-edu-teal/80"
                    >
                        Join the Network
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default AlumniPage;
