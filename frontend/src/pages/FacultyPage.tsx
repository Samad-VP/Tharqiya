import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, GraduationCap, Users, Loader2 } from 'lucide-react';
import api from '../api/axiosInstance';

const FacultyPage: React.FC = () => {
    const [faculties, setFaculties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await api.get('/faculty');
                setFaculties(response.data.data || []);
            } catch (error) {
                console.error('Error fetching faculty:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculties();
    }, []);

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
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-teal/10 text-edu-teal text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-teal/20">
                            Academic Excellence
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-brand-deep dark:text-white font-outfit mb-6 tracking-tighter uppercase leading-none">
                            Our <span className="text-edu-teal">Faculty</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-brand-deep/80 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
                            A distinguished panel of world-class scholars and academic professors dedicated to nurturing future leaders.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] pointer-events-none" />
            </section>

            {/* Faculty Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-edu-teal animate-spin" />
                            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Assembling Faculty...</p>
                        </div>
                    ) : faculties.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                            {faculties.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-4 bg-gradient-to-br from-edu-teal/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative p-6 sm:p-10 rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all duration-500">
                                        {/* Profile Avatar */}
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700">
                                            {member.photoUrl ? (
                                                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-10 h-10 sm:w-16 sm:h-16 text-slate-100 dark:text-slate-800" />
                                            )}
                                        </div>

                                        <div className="flex-grow space-y-4">
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                <span className="px-3 py-1 bg-edu-teal text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {member.category}
                                                </span>
                                                <span className="px-3 py-1 bg-edu-coral text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {member.department}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <h3 className="text-2xl sm:text-3xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-tighter leading-tight">
                                                    {member.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm font-black text-edu-teal uppercase tracking-widest">
                                                    {member.position}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                    <Award className="w-4 h-4 text-edu-coral" />
                                                    Academic Expert
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-brand-deep dark:text-white font-outfit uppercase tracking-[0.2em] mb-4">Registry In Progress</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Our esteemed faculty list is being updated.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Motivational Quote */}
            <section className="py-24 bg-brand-deep text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <BookOpen className="w-12 h-12 text-edu-teal/40 mx-auto mb-8 animate-bounce" />
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tighter max-w-4xl mx-auto leading-tight italic opacity-90">
                            "The scholar's ink is more sacred than the blood of martyrs. Our faculty represents the living bridge between timeless wisdom and contemporary challenge."
                        </h2>
                    </motion.div>
                </div>
                <div className="absolute inset-0 bg-edu-teal/5 mix-blend-overlay" />
            </section>
        </div>
    );
};

export default FacultyPage;
