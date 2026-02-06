import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Microscope, Languages, Music, Heart, Mail, ExternalLink, Award, Users, Loader2, Quote } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils/animations';
import SEO from '../components/SEO';
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
        <div className="bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500 min-h-screen">
            <SEO 
                title="Our Faculty | World-Class Scholars & Academic Mentors" 
                description="Meet the distinguished faculty at Tharqiya Course. Internationally trained Islamic scholars and experienced professors dedicated to nurturing the next generation of Huffaz." 
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://darussalameduvillage.com"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Faculty",
                            "item": "https://darussalameduvillage.com/faculty"
                        }
                    ]
                }}
            />
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-48 sm:pb-32 bg-tharqiya-cream dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-edu-teal/10 text-edu-teal text-[10px] sm:text-xs font-black tracking-widest uppercase mb-6 border border-edu-teal/20">
                            Academic Excellence
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-tharqiya-deep dark:text-white font-outfit mb-6 tracking-tighter uppercase leading-none">
                            Our <span className="text-gold-orange">Faculty</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-academic-muted max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
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
                                        variants={fadeInUp}
                                        initial="initial"
                                        whileInView="animate"
                                        viewport={{ once: true }}
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
                                                <h3 className="text-2xl sm:text-3xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit uppercase tracking-tighter leading-tight">
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
                            <h3 className="text-xl font-black text-tharqiya-deep dark:text-slate-100 font-outfit uppercase tracking-[0.2em] mb-4">Registry In Progress</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Our esteemed faculty list is being updated.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Motivational Quote - Premium Academic Section */}
            <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-tharqiya-cream dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glassmorphic Quote Card */}
                        <div className="relative p-6 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/5 shadow-2xl overflow-hidden group">
                            {/* Decorative Islamic Pattern Background */}
                            <div className="absolute inset-0 islamic-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                            
                            {/* Animated Background Glow */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-edu-teal/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-edu-coral/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

                            <div className="relative z-10 text-center space-y-6 sm:space-y-10">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-edu-teal/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <Quote className="w-10 h-10 sm:w-16 sm:h-16 text-edu-teal/40 mx-auto relative z-10" />
                                </div>

                                <blockquote className="relative">
                                    <h2 className="text-xl sm:text-3xl md:text-5xl font-playfair italic leading-[1.3] text-tharqiya-deep dark:text-white transition-colors duration-500 max-w-5xl mx-auto">
                                        "The <span className="text-gold-orange font-black not-italic font-outfit">Scholar's Ink</span> is more sacred than the blood of martyrs. Our faculty represents the living bridge between <span className="text-gold-orange font-black not-italic font-outfit">Timeless Wisdom</span> and contemporary challenge."
                                    </h2>
                                </blockquote>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-edu-teal/30 to-transparent rounded-full" />
                                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-academic-muted">
                                        The Tharqiya Academic Ethos
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Accents */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-3xl -rotate-12 animate-float -z-10 hidden lg:block" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2rem] rotate-12 animate-float [animation-delay:2s] -z-10 hidden lg:block" />
                    </motion.div>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-edu-teal/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-edu-coral/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
            </section>
        </div>
    );
};

export default FacultyPage;
